export default async function decorate(block) {
    let numOfChild = block.childElementCount;
    const navigationItems = [...block.children]
        .map((element, index) => {
            const href = element.getElementsByTagName('a')[0].getAttribute('href');
            const textContent = element.getElementsByTagName('a')[0].getInnerHTML();
            //const textContent = ` | ${element.getElementsByTagName('a')[0].getInnerHTML()}${index == numOfChild - 1 ? ' |' : ''}`;
            return `<mj-navbar-link href="${href}">${textContent}</mj-navbar-link>`;
        })

    return `
        <mj-section mj-class="mj-navbar-container">
            <mj-column mj-class="mj-navbar-column">
                <mj-navbar hamburger="none">
                    ${navigationItems.join('   ')}
                </mj-navbar>
            </mj-column>
        </mj-section>
    `
}
