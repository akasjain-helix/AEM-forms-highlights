export default async function decorate(block) {
    const columns = [...block.children];
    
    if (columns.length === 0) {
        return `<mj-section mj-class="mj-metric-section-wrapper">
            <mj-column mj-class="mj-metric-column" width="90%">
                <mj-section mj-class="mj-metric-section-content">
                    <mj-column mj-class="mj-metric-inner-column">
                        <mj-text mj-class="mj-metric-text">No metrics found</mj-text>
                    </mj-column>
                </mj-section>
            </mj-column>
        </mj-section>`;
    }

    // Parse each column and determine content type for fixed spacers
    const metricColumns = columns.map((column, columnIndex) => {
        const rows = [...column.children];
        let primaryText = '';
        let coloredText = '';
        let description = '';
        let textColor = '#008000'; // default green

        rows.forEach((row, index) => {
            const cellContent = row.textContent.trim();
            
            if (index === 0 && cellContent) {
                // First row is the primary text (can be number or text like "Live < 50 days")
                primaryText = cellContent;
            } else if (index === 1 && cellContent) {
                // Second row is colored text with optional color configuration
                if (cellContent.includes('color=')) {
                    const parts = cellContent.split('color=');
                    coloredText = parts[0].trim();
                    const colorSpec = parts[1].trim().toLowerCase();
                    
                    // Set color based on specification
                    if (colorSpec === 'red') {
                        textColor = '#d32f2f';
                    } else if (colorSpec === 'green') {
                        textColor = '#008000';
                    } else if (colorSpec.startsWith('#')) {
                        textColor = colorSpec;
                    }
                } else {
                    coloredText = cellContent;
                }
            } else if (index === 2 && cellContent) {
                // Third row is description text
                description = cellContent;
            }
        });

        // Build the metric column MJML
        let columnContent = '';
        
        if (primaryText) {
            // HTML encode special characters like < > & to prevent parse errors
            const encodedPrimaryText = primaryText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            columnContent += `<mj-text mj-class="mj-metric-number" align="center" padding-bottom="15px">${encodedPrimaryText}</mj-text>`;
        }
        
        if (coloredText) {
            // HTML encode special characters
            const encodedColoredText = coloredText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            columnContent += `<mj-text mj-class="mj-metric-colored-text" align="center" color="${textColor}" padding-bottom="5px">${encodedColoredText}</mj-text>`;
        }
        
        if (description) {
            // HTML encode special characters
            const encodedDescription = description
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            columnContent += `<mj-text mj-class="mj-metric-description" align="center" padding-top="5px">${encodedDescription}</mj-text>`;
        }



        // Determine if this is the last column for border logic
        const isLastColumn = columnIndex === columns.length - 1;
        const borderRight = isLastColumn ? '2px solid #f4a261' : 'none';

        return `<mj-column mj-class="mj-metric-card-column" border="2px solid #f4a261" border-bottom="2px solid #f4a261" border-right="${borderRight}" padding="10px 10px">
            ${columnContent}
        </mj-column>`;
    });

    // Check if there's a header in the first row
    let headerTitle = 'Value Realization';
    const firstRow = block.querySelector('tr');
    if (firstRow && firstRow.children.length === 1) {
        headerTitle = firstRow.textContent.trim();
        // Remove the header row from columns processing
        firstRow.remove();
    }

    let headerSection = '';
    if (headerTitle) {
        // HTML encode special characters in header
        const encodedHeaderTitle = headerTitle
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        headerSection = `
            <mj-section mj-class="mj-metric-header-section mj-first" width="82%" padding-bottom="0">
                <mj-column mj-class="mj-metric-header-column" width="82%">
                    <mj-text mj-class="mj-metric-header-title mj-content-text" align="center" width="82%">${encodedHeaderTitle}</mj-text>
                </mj-column>
            </mj-section>
        `;
    }

    return `
        ${headerSection}
        <mj-section mj-class="mj-metric-section-wrapper">
            <mj-column mj-class="mj-metric-column" width="82%">
                <mj-section mj-class="mj-metric-section-content" padding-top="0">
                    ${metricColumns.join('')}
                </mj-section>
            </mj-column>
        </mj-section>
    `;
}
