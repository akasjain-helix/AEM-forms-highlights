class EmailSidekickBanner {
  constructor(id) {
    this.banner = document.createElement('div');
    this.banner.className = 'email-sidekick-banner';
    this.banner.id = id;
    this.banner.appendChild(document.createElement('style')).textContent = `
      .email-sidekick-banner {
        z-index: 9999998;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        font-family: Arial, sans-serif;
        font-size: 1rem;
        background-color: red;
        color: white;
        padding: 0 20px;
      }
      .email-sidekick-banner a:any-link {
        color: white;
      }
      .email-sidekick-banner input,
      .email-sidekick-banner button {
        font-family: Arial, sans-serif;
        font-size: 1rem;
        background: transparent;
        color: white;
      }
      .email-sidekick-banner input {
        outline: none;
        border: none;
        width: 400px;
        text-overflow: ellipsis;
      }
      .email-sidekick-banner button {
        border: solid 1px white;
        border-radius: 8px;
        padding: 5px 8px;
        margin-left: 5px;
        user-selection: none;
        cursor: pointer;
      }`;
    this.bannerContent = this.banner.appendChild(document.createElement('p'));
    this.bannerContent.className = 'content';
    document.body.prepend(this.banner);
  }

  querySelector(selector) {
    return this.bannerContent.querySelector(selector);
  }

  write(content, timeout) {
    this.bannerContent.innerHTML = content;
    if (timeout) {
      this.hide(timeout);
    }
  }


  hide(timeout = 0) {
    setTimeout(() => {
      this.banner.remove();
    }, timeout * 1000);
  }
}

const copyHtml = () => {
  const iframe = document.getElementById('__emailFrame');
  if (iframe) {
    navigator.clipboard.writeText(iframe.srcdoc).then(() => {
      const banner = new EmailSidekickBanner('get-html-data');
      banner.write('HTML copied to clipboard', 5);
    });
  }
};

// Outlook does not render data: URI images, so images are embedded as
// MIME parts (multipart/related) and referenced from the HTML via cid:.
const inline_img = (html) => {
  // Clone into an inert document so the live preview keeps its original
  // image sources and the browser does not try to fetch cid: URLs.
  var root = html.contentDocument.documentElement;
  var inertDoc = document.implementation.createHTMLDocument('');
  var clone = inertDoc.importNode(root, true);
  var images = Array.from(root.getElementsByTagName('img'));
  var cloneImages = Array.from(clone.getElementsByTagName('img'));
  var attachments = [];

  for(var i = 0; i < images.length; i++) {

    var img = images[i];
    var cloneImg = cloneImages[i];
    if (!clone.contains(cloneImg)) {
      // already removed as a video controls overlay
      continue;
    }

    var h = img.height
    var w = img.width

    var c = document.createElement('canvas');

    c.height = h;
    c.width = w;
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0, c.width, c.height)

    if( img.classList.contains('video')) {
      ctx.drawImage(img.nextElementSibling, 0, 0, c.width, c.height);
      if (cloneImg.nextElementSibling) {
        cloneImg.nextElementSibling.remove();
      }
    }

    var cid = 'image' + i + '@newsletter';
    attachments.push({
      cid: cid,
      name: 'image' + i + '.png',
      data: c.toDataURL("image/png").split(',')[1],
    });
    cloneImg.src = 'cid:' + cid;

    // reset height and width to original value
    cloneImg.height = h
    cloneImg.width = w
  }
  // <picture><source srcset> points to relative page URLs that email clients
  // cannot resolve and would prefer over the cid: <img>, so drop them.
  clone.querySelectorAll('picture source').forEach((s) => s.remove());

  // Outlook drops empty <p> elements, which removes mj-divider lines.
  // Replace them with a table row that carries the border.
  clone.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim() || p.children.length || !/border-top/.test(p.style.cssText)) {
      return;
    }
    var border = p.style.borderTop.replace(/lightgrey/i, '#d3d3d3');
    var table = inertDoc.createElement('table');
    table.setAttribute('role', 'presentation');
    table.setAttribute('width', '100%');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('border', '0');
    table.innerHTML = '<tr><td style="border-top:' + border
      + ';font-size:1px;line-height:1px;height:1px;">&nbsp;</td></tr>';
    p.replaceWith(table);
  });

  return { html: clone.outerHTML, attachments: attachments };
}

const toBase64Utf8 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

const wrap76 = (str) => str.replace(/(.{76})/g, '$1\r\n');

const buildMime = (headers, html, attachments) => {
  const boundary = '----=_NewsletterPart_' + Date.now().toString(36);
  let mime = headers.join('\r\n') + '\r\n'
    + 'MIME-Version: 1.0\r\n'
    + 'Content-Type: multipart/related; type="text/html"; boundary="' + boundary + '"\r\n'
    + '\r\n'
    + '--' + boundary + '\r\n'
    + 'Content-Type: text/html; charset=utf-8\r\n'
    + 'Content-Transfer-Encoding: base64\r\n'
    + '\r\n'
    + wrap76(toBase64Utf8(html)) + '\r\n';
  attachments.forEach((a) => {
    mime += '--' + boundary + '\r\n'
      + 'Content-Type: image/png; name="' + a.name + '"\r\n'
      + 'Content-Transfer-Encoding: base64\r\n'
      + 'Content-ID: <' + a.cid + '>\r\n'
      + 'Content-Disposition: inline; filename="' + a.name + '"\r\n'
      + '\r\n'
      + wrap76(a.data) + '\r\n';
  });
  return mime + '--' + boundary + '--\r\n';
}

const downloadHtmlWindows = () => {
  downloadHtml("eml");
}

const downloadHtml = (event) => {
  let fileExtension = "emltpl";
  if(event.type === "custom:downloadHtmlWindows") {
    fileExtension = "eml";
  }

  const today = new Date();
  let month = today.getMonth(); // 0-based index for months
  let year = today.getFullYear();

  if (today.getDate() >= 1 && today.getDate() <= 10) {
    month = month === 0 ? 11 : month - 1; // Handle January case
    year = month === 11 ? year - 1 : year;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const iframe = document.getElementById('__emailFrame');
  if (iframe) {
    const h1 = iframe.contentWindow.document.body.querySelector('h1');
    const title = h1 ? h1.innerText : `Experience Manager Forms Engineering Updates | ${monthNames[month]} ${year}`;
    const subject = `Subject: ${title}`;
    const to = 'To: prjain@adobe.com';
    const { html, attachments } = inline_img(iframe);

    const fileName = title
                         .replaceAll(/\W+/g, '-')
                         .replaceAll(/[-]{2,}/g, '-')
                         .toLowerCase()
                     + '.' + fileExtension

    const eml = buildMime([to, subject, 'X-Unsent: 1'], html, attachments);
    const blob = new Blob([eml], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);

    const fileLink = document.createElement('a');
    var linkText = document.createTextNode(fileName);
    fileLink.appendChild(linkText);
    fileLink.href = url;
    fileLink.download = fileName;
    fileLink.style.visibility = 'hidden';

    fileLink.onclick = () => {
      setTimeout(() => {
        fileLink.remove();
        URL.revokeObjectURL(url);
      })
    }

    document.body.appendChild(fileLink);
    fileLink.click();
  }
}



const sk = document.querySelector('helix-sidekick, aem-sidekick')
sk.addEventListener('custom:downloadHtml', downloadHtml);
sk.addEventListener('custom:downloadHtmlWindows', downloadHtml);
sk.addEventListener('custom:copyHtml', copyHtml);


window.addEventListener('message', ({ data, origin, source }) => {
  if (data === 'mjml2html' && origin.match('localhost(:\\d+)?$|.*\\.hlx\\.(page|live)$')) {
    const iframe = document.getElementById('__emailFrame');
    source.postMessage('mjml2html:' + (iframe ? iframe.srcdoc : ''), origin);
  }
})
