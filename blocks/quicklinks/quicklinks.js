export default async function decorate(block) {
    // Extract all link elements from the block
    const linkElements = [...block.querySelectorAll('a')];
    
    if (linkElements.length === 0) {
        return `<mj-section mj-class="mj-quicklinks-section-wrapper">
            <mj-column mj-class="mj-quicklinks-column" width="80%">
                <mj-section mj-class="mj-quicklinks-section-content">
                    <mj-column mj-class="mj-quicklinks-inner-column">
                        <mj-text mj-class="mj-quicklinks-text">No links found</mj-text>
                    </mj-column>
                </mj-section>
            </mj-column>
        </mj-section>`;
    }

    // Create the quick links navigation items
    const quickLinksItems = linkElements
        .map((link, index) => {
            const href = link.getAttribute('href') || '#';
            const textContent = link.textContent.trim();
            const isLast = index === linkElements.length - 1;
            
            return `<mj-text mj-class="mj-quicklinks-item">
                <a href="${href}" class="quicklink" style="color: #1473e6; text-decoration: none; font-weight: 600;">${textContent}</a>${isLast ? '' : ' | '}
            </mj-text>`;
        });

    return `
        <mj-section mj-class="mj-quicklinks-section-wrapper">
            <mj-column mj-class="mj-quicklinks-column" width="80%">
                <mj-section mj-class="mj-quicklinks-section-content">
                    <mj-column mj-class="mj-quicklinks-inner-column">
                        <mj-text mj-class="mj-quicklinks-header" align="center" padding-bottom="20px">QUICK LINKS</mj-text>
                        <mj-table mj-class="mj-quicklinks-table" width="100%" align="center">
                            <tr>
                                ${linkElements.map((link, index) => {
                                    const href = link.getAttribute('href') || '#';
                                    const textContent = link.textContent.trim();
                                    const isLast = index === linkElements.length - 1;
                                    
                                    return `<td style="padding: 5px 5px; text-align: center; border-right: ${isLast ? 'none' : '1px solid #666'};">
                                        <a href="${href}" style="color: #1473e6; text-decoration: none; font-weight: 600; font-size: 14px;">${textContent}</a>
                                    </td>`;
                                }).join('')}
                            </tr>
                        </mj-table>
                    </mj-column>
                </mj-section>
            </mj-column>
        </mj-section>
    `;
}
