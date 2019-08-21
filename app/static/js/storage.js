function storageAvailable(type) {
    try {
        var storage = window[type],
            x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}

function checkLocalStorage() {
    if (Storage !== void(0)) {
        return true; // Yes
    }
    alert("localStorage is unavailable in this browser. Please try updating it or use Chrome");
    return false;
}


function validateStorage(org) {
    try {
        localStorageData = JSON.parse(localStorage[org]);
        localVersion = localStorageData.version;
    } catch(e) {
        localVersion = "0";
    }
    console.debug("localStorage version for " + DB_NAME + " is v" + localVersion);
    if(localVersion < DB_VERSION) {
        console.debug("Site DB_VERSION is " + DB_VERSION)
        console.debug("Clearing localStorage['" + DB_NAME + "']...");
        localStorage.removeItem(org);
        storage = {};
        return $.when(
            $.get(PATH_API + "all/"), // Get orgs
            $.get(PATH_API + "table/") // Get table
        ).then(function(orgs, table) {
            storage = {
                "orgs": orgs[0],
                "table": table[0],
                "version": DB_VERSION
            };
            localStorage[org] = JSON.stringify(storage);
            console.debug("Updated to v" + DB_VERSION);
            return storage;
        });
    }
    return localStorageData;
}
