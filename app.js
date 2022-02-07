

function getAccessToken() {

    const url = 'https://auth-integration.servicetitan.io/connect/token'
    //const client_id = 'cid.i2w70lfqjm62kyiv8hwkicmqz'// default
    //const client_secret = 'cs1.qlbs9sqo9nb7m6g5w952d1w250r4vm186l59wdwmymy2oyvcgr'// default
    const client_id = 'cid.04k05qztbij866ih9478ibzd9'; // full access
    const client_secret = 'cs1.q76d0zs4dfgpz96go216zb6isxs7j2ahcb2jp5drhy6f2ridiw'; // full access



    const data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    };

    const options = {
        'method': 'post',
        //'mode': 'no-cors',
        'mutehttpexceptions': true,
        'contentType': 'application/x-www-form-urlencoded',
        'payload': data
    };

    fetch(url, options)
    .then(function (response) {
        document.body.innerHTML = response.status
    })
    .catch(function (err) {
        document.body.innerHTML = err
    });

    

    //return JSON.parse(accessToken).access_token
}


function buildHeader(accessToken, appKey) {
    const header = {
        'authorization': accessToken,
        'ST-App-Key': appKey
    }
    return header
}


function buildUrls(tenant) {
    const urls = {
        'accounting': {
            'get': {
                'invoices': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/invoices`,
                'payments': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/payments`,
                'payment_types': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/payment-types`,
                'tax_zones': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/tax-zones`
            },
            'post': {
                'invoices': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/invoices`,
                'mark_as_exported': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/invoices/markasexported`,
                'payments': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/payments`,
                'status': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/payments/status`
            },
            'patch': {
                'invoices_custom_fields': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/invoices/custom-fields`,
                'payments_custom_fields': `https://api-integration.servicetitan.io/accounting/v2/tenant/${tenant}/payments/custom-fields`
            },
            'del': {

            }
        },
        'crm': {
            'get': {
                'leads': `https://api-integration.servicetitan.io/crm/v2/tenant/${tenant}/leads`
            }
        },
        'dispatch': {
            'get': {
                'appt_assignments': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenant}/appointment-assignments`,
                'tech_shifts': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenant}/technician-shifts`
            },
            'post': {
                'appt_assignments': {
                    'assign': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenant}/appointment-assignments/assign-technicians`,
                    'unassign': `https://api-integration.servicetitan.io/dispatch/v2/tenant/${tenant}/appointment-assignments/unassign-technicians`
                }
            }
        },
        'jpm': { //job planning and mamangement
            'get': {
                'appts': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/appointments`,
                'job_cancel_reasons': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/job-cancel-reasons`,
                'job_hold_reasons': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/job-hold-reasons`,
                'jobs': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/jobs`
            },
            'post': {
                'appts': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/appointments`,
                'jobs': `https://api-integration.servicetitan.io/jpm/v2/tenant/${tenant}/jobs`
            }
        },
        'marketing': {
            'get': {
                'campaigns': `https://api-integration.servicetitan.io/marketing/v2/tenant/${tenant}/campaigns`
            }
        },
        'memberships': {
            'get': {
                'memberships': `https://api-integration.servicetitan.io/memberships/v2/tenant/${tenant}/memberships`
            }
        }
    }

    return urls
}


function convertJSONtoCSV(json) {
    const data = json.data
    console.log(`items:\n${data}`)
    const replacer = (key, value) => value === null ? 'test' : value // specify how you want to handle null values here
    const header = Object.keys(data[0])
    const csv = [
        header.join(','), // header row first
        ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    console.log(csv);

    console.log(csv.length)

    return csv
}


function convertJSONto2dArray(json) {
    const data = json.data

    let header = [];
    let arr = [];


    data.forEach(obj => {
        Object.keys(obj).forEach(key => header.includes(key) || header.push(key))
        let thisRow = new Array(header.length);
        header.forEach((col, i) => thisRow[i] = obj[col] || '')
        arr.push(thisRow);
    })
    arr.unshift(header);

    Logger.log(arr);

    return arr

}


function sendDataToSpreadsheet(arr) {
    const ss = SpreadsheetApp.openById('1i5zNY3_Y9PId1FA8wgzZcS_GiwS8rP6NIjc_hkkyWLc');
    const sh = ss.getSheetByName('data');
    sh.getRange(1, 1, arr.length, arr[0].length).setValues(arr);
}


//Called from the client with form data, basic validation for blank values
function formSubmit(formData) {
    for (var field in formData) {
        if (formData[field] == '') {
            return { success: false, message: field + ' Cannot be blank' }
        }
    }
    return { success: true, message: 'Sucessfully submitted!' };
}


function getData() {
    const tenantId = 986291513;
    const accessToken = getAccessToken();
    //const appKey = 'ak1.abiyt6tq274qx4fklzlhgbgu6';//get only
    const appKey = 'ak1.bdq6bwfhtc4lg7gt16y4n1rj6';//full access
    const urls = buildUrls(tenantId);

    const header = buildHeader(accessToken, appKey);

    const options = {
        "jobId": 1117,
        "start": new Date(),
        "end": new Date(),
        "arrivalWindowStart": new Date(),
        "arrivalWindowEnd": new Date(),
        "technicianIds": [847, 859],
        "specialInstructions": 'This is a fake job'
    }

    const getPayload = {
        'muteHttpExceptions': true,
        'method': 'get',
        'headers': header,
    }
    const postPayload = {
        'muteHttpExceptions': true,
        'method': 'post',
        'headers': header,
        'payload': options
    }

    const response = fetch(urls.jpm.get.appts, getPayload)

    const responseData = JSON.parse(response);


    for (const i of responseData.data) {
        for (key in i) {
            //Logger.log(i[key])
            if (i[key] == 2100) {
                Logger.log('found job...')
            }
        }
    }

    console.log(JSON.stringify(responseData.data[responseData.data.length - 1], null, 2))

    //const arr = convertJSONto2dArray(responseData)

    //sendDataToSpreadsheet(arr)

}

function findJob(id) {
    return (is ? '$2.00' : '$10.00');
}


getAccessToken()