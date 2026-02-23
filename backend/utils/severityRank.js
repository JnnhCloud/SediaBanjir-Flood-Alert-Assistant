//

//

function getSeverityRank(status) {
    switch (status?.toLowerCase()) {
        case "danger":
            return 3;
        case "warning":
            return 2;
        case "alert":
            return 1;
        default:
            return 0;
    }
}

module.exports = { getSeverityRank };