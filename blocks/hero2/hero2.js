export default function decorate(block) {
    const version = block.innerText.replace(/\n/g, '').trim();

    const logoUrl = new window.URL(`${window.hlx.codeBasePath}/media_1de95853de907d3bdc6250a3a2127b1808a32ca47.png`, window.location.href);

    return `
    <mj-wrapper padding-bottom="0">
        <mj-section mj-class="mj-hero-section">
             <mj-column width="100%">
                <mj-hero 
                      background-url="${logoUrl}?height=120&width=750">
                  <mj-text 
                        padding="40px"
                        padding-left="400px"
                        padding-top="40px"
                        color="#000000"
                        font-size="24px"
                        background-color="#ffffff !important">
                    <div style="background-color: white; padding: 10px;">
                        ${version}
                    </div>
                  </mj-text>
                </mj-hero>
            </mj-column>       
        </mj-section>
    </mj-wrapper>
    `;
}
