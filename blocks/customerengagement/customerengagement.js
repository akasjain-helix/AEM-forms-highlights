export default function decorate(block) {
    const isSmall = block.classList.contains('engagement');
    const isMedium = block.classList.contains('info');
    let className;
    if(isSmall) {
        className = 'mj-card';
    } else if (isMedium) {
        className = 'mj-card-medium';
    } else {
        className = 'mj-card-small';
    }

    const numOfFeatures = block.childElementCount;

    let result = `<mj-section mj-class="mj-content-section">
                        <mj-column width="100%" align="left" mj-class="${className}">`;
    for (let i = 0; i < numOfFeatures; i++) {

        let childContainer = block.children[i].querySelector('div > div').children;
        let heading = childContainer[0];

        if (heading.tagName === 'H3') {
            // remove first child from childContainer
            childContainer[0].remove();
        }
        let text = Array.from(childContainer).map(child => child.outerHTML).join(' ');

        result = result + `
                ${i != 0 ? '<mj-divider border-color="lightgrey" border-width="2px"/>': ''}
                ${heading.tagName === 'H3' ? '<mj-text><h3>' + heading.innerHTML + '</h3></mj-text>' : '' }
                <mj-text mj-class="mj-text-content">${text}</mj-text>
                `;
    }

    result = result + `</mj-column></mj-section>`;
    return result;
}
