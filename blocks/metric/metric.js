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
        let number = '';
        let coloredText = '';
        let description = '';
        let textColor = '#008000'; // default green

        rows.forEach((row, index) => {
            const cellContent = row.textContent.trim();
            
            if (index === 0 && cellContent) {
                // First row is the large number
                number = cellContent;
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
        
        if (number) {
            columnContent += `<mj-text mj-class="mj-metric-number" align="center" padding-bottom="15px">${number}</mj-text>`;
        }
        
        if (coloredText) {
            columnContent += `<mj-text mj-class="mj-metric-colored-text" align="center" color="${textColor}" padding-bottom="5px">${coloredText}</mj-text>`;
        }
        
        if (description) {
            columnContent += `<mj-text mj-class="mj-metric-description" align="center" padding-top="5px">${description}</mj-text>`;
        }



        // Determine if this is the last column for border logic
        const isLastColumn = columnIndex === columns.length - 1;
        const borderRight = isLastColumn ? '2px solid #f4a261' : 'none';

        return `<mj-column mj-class="mj-metric-card-column" border="2px solid #f4a261" border-right="${borderRight}" padding="10px 10px">
            ${columnContent}
        </mj-column>`;
    });

    // Check if there's a header in the first row
    let headerTitle = 'VALUE REALIZATION';
    const firstRow = block.querySelector('tr');
    if (firstRow && firstRow.children.length === 1) {
        headerTitle = firstRow.textContent.trim();
        // Remove the header row from columns processing
        firstRow.remove();
    }

    let headerSection = '';
    if (headerTitle) {
        headerSection = `
            <mj-section mj-class="mj-metric-header-section mj-first" width="90%" padding-bottom="0">
                <mj-column mj-class="mj-metric-header-column" width="90%">
                    <mj-text mj-class="mj-metric-header-title mj-content-text" align="center" width="90%">${headerTitle}</mj-text>
                </mj-column>
            </mj-section>
        `;
    }

    return `
        ${headerSection}
        <mj-section mj-class="mj-metric-section-wrapper">
            <mj-column mj-class="mj-metric-column" width="90%">
                <mj-section mj-class="mj-metric-section-content" padding-top="0">
                    ${metricColumns.join('')}
                </mj-section>
            </mj-column>
        </mj-section>
    `;
}
