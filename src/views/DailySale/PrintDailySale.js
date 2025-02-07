import { ServicePdf } from '../../utilities/ServicePDF/ServicePdf'
const PrintDailySale = async (record) => {
    const { createPdf } = ServicePdf()
    var docDefinition = {
        content: [
            {
                text: 'This is a header, using header style 123 ทดสอบฟอนด์ ภาษาไทย',
                style: 'header',
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
            },
            subheader: {
                fontSize: 15,
                bold: true,
            },
            quote: {
                italics: true,
            },
            small: {
                fontSize: 8,
            },
        },
    }

    const export_pdf = await createPdf(docDefinition)
    export_pdf.print()
}

export default PrintDailySale
