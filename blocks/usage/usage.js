export default function decorate(block) {
    const numOfFeatures = block.childElementCount;

    let result = `<mj-section padding-left="70px" padding-right="70px" background-color="#FFFFFF">
                        <mj-column align="left" mj-class="mj-card=0">
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
        //let text = Array.from(childContainer).map(child => child.outerHTML).join(' ');
        //const img = text.querySelector('img');
        const img = childContainer[0].querySelector('img');
        const src = img.src;

        row2 = row2 + `<td width='${width}%'><img src='${src}' width='64' height='64'/></td>`;

    }
    result = result + `<tr>${row1}</tr><tr>${row2}</tr>`
    result = result + `</tbody></table></mj-text></mj-column></mj-section>`;
    return result;
}
