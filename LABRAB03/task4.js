const _ = require('lodash');
const ut = require('./ut01');

let students = ut.csv_to_json('./csv/students.csv');
let groups = ut.csv_to_json('./csv/groups.csv');

let adultOnlyForGroup = (group) => {
    let groupId = _.find(groups, {'nameGr': group}).id;
    let res = _(students)
        .filter({'idGr': groupId})
        .filter(x => x.age > 17)
        .value()
    return res;
}

let group = "ПИб-1";
console.table(adultOnlyForGroup(group));