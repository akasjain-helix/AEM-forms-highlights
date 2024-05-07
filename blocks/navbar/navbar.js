export default async function decorate(block) {

    const navigationItems = [...block.children]
        .map((element) => {
            const href = element.getElementsByTagName('a')[0].getAttribute('href');
            const textContent = element.getElementsByTagName('a')[0].getInnerHTML();
            return `<mj-navbar-link href="${href}">${textContent}</mj-navbar-link>`;
        })

    return `
        <mj-section mj-class="mj-navbar-container">
            <mj-column mj-class="mj-navbar-column">
                <mj-navbar hamburger="none">
                    ${navigationItems.join(' | ')}
                </mj-navbar>
            </mj-column>
        </mj-section>
    `
}
