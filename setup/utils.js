function formatNamesList(names, nameSingular, namePlural) {
    if (names.length === 0) {
        return '';
    }

    if (names.length === 1) {
        return `${nameSingular} "${names.toString()}"`;
    }

    if (names.length === 2) {
        return `${namePlural} "${names.join('" and "')}"`;
    }

    return `${namePlural} "${names.slice(0, -1).join('", "')}" and "${names.slice(-1)}"`;
}

function reportError(err) {
    console.error('Something went wrong: %o', err.response ? err.response.body : err);
}

function isLocalhost(url) {
    const hostname = new URL(url).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
}

module.exports = {
    formatNamesList,
    reportError,
    isLocalhost
};
