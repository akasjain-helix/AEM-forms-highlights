async function createTemplate(name, description, email) {
    return fetch('https://platform.adobe.io/journey/authoring/message/templates', {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/vnd.adobe.cjm.template.v1+json',
            'Authorization': `Bearer ${sessionStorage.getItem('ims-token')} `,
            'x-api-key': 'ajo-aem-integration',
            'x-gw-ims-org-id': '908936ED5D35CC220A495CD4@AdobeOrg',
            'x-sandbox-name': 'prod',
        },
        method: 'POST',
        body: JSON.stringify({
                                 "name": name || `Email ${Date.now()}`,
                                 "description": description || "Email created by Franklin",
                                 "templateType": "html",
                                 "channels": [
                                     "email"
                                 ],
                                 "tagIds": [],
                                 "labels": [
                                     "string"
                                 ],
                                 "template": {
                                     "html": email
                                 },
                                 "source": {
                                     "origin": "aem"
                                 }
                             }),
    });
}
