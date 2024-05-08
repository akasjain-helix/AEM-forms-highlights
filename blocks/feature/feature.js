export default function decorate(block) {
    const numOfFeatures = block.childElementCount;

    let result = `<mj-section padding-left="70px" padding-right="70px" background-color="#FFFFFF">
                        <mj-column width="100%" align="left" mj-class="mj-card">`;
    for (let i = 0; i < numOfFeatures; i++) {

        let childContainer = block.children[i].querySelector('div > div').children;
        let heading = childContainer[0];

        if(heading.tagName === 'H3') {
            // remove first child from childContainer
            childContainer[0].remove();
        }
        let text = Array.from(childContainer).map(child => child.outerHTML).join(' ');

        result = result + `
                ${i != 0 ? '<mj-divider border-color="lightgrey" border-width="2px"/>&nbsp;': ''}
                ${heading.tagName === 'H3' ? '<mj-text><h3>' + heading.innerHTML + '</h3></mj-text>' : '' }
                <mj-text>${text}</mj-text>
                `;
    }

    result = result + `</mj-column></mj-section>`;
    return result;
}
