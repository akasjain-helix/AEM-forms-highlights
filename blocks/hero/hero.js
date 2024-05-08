export default function decorate(block) {
    const version = block.innerText.replace(/\n/g, '').trim();

    // mj-hero has an issue with outlook in mode='fluid-height' https://github.com/mjmlio/mjml/issues/1253
    // the recommendation is to use a section instead
    // the 2nd column is used to give the section a min-height

    const logoUrl = new window.URL(`${window.hlx.codeBasePath}/media_1de95853de907d3bdc6250a3a2127b1808a32ca47.png`, window.location.href);

    return `
    <mj-wrapper padding-bottom="0">
        <mj-section width="750px" mj-class="mj-hero-section" background-url="${logoUrl}?height=125&width=750" background-repeat="no-repeat">
             <mj-column width="100%" text-align="right">
                <mj-text mj-class="mj-hero-text">${version}</mj-text>
            </mj-column>
            <mj-column width="0%">
                <mj-spacer mj-class="mj-hero-min-height" />
            </mj-column>        
        </mj-section>
    </mj-wrapper>
    `;
}
