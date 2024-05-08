export default function decorate(block) {
    const numOfFeatures = block.childElementCount;

    let result = `<mj-section mj-class="mj-content-section">
                        <mj-column align="left" >
                        <mj-text><table>
                        <tbody>`;
    let row1 = "";
    let row2 = "";
    const width = 100/numOfFeatures;
    for (let i = 0; i < numOfFeatures; i++) {
        let childContainer = block.children[i].querySelector('div > div').children;

        let heading = childContainer[0];

        if (heading.tagName === 'H3') {
            // remove first child from childContainer
            childContainer[0].remove();
            row1 = row1 + `<td width='${width}%'>${heading.outerHTML}</td>`;
        }
        const img = childContainer[0].querySelector('img');
        const img_width = (750/numOfFeatures) * 0.8;
        const img_height = img_width * (img.height/img.width);
        const src = img.src;

        row2 = row2 + `<td width='${width}%'><img src='${src}' width='${img_width}' height='${img_height}'/></td>`;

    }
    result = result + `<tr>${row1}</tr><tr>${row2}</tr>`
    result = result + `</tbody></table></mj-text></mj-column></mj-section>`;
    return result;
}
