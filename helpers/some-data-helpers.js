import _ from "lodash";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Some Custom Lists Helpers - For Clients as well as the Server
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function getListTitleFromListId(listId) {
  const listTitle = _.kebabCase(listId.toLowerCase())
    .replace(/-+/g, ' ')
    .replace(/\b(\w)/g, ((x) => x.toUpperCase()));
  return listTitle;
}

export function getListIdFromListTitle(listTitle) {
  const listId = _.kebabCase(listTitle.toLowerCase());
  return listId;
}

/****** FAST TEST CODE SECTION
 * 
let testListId = '',
    testListTitle = '';

testListId = '1234';
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);

testListId = 'agata-christie';
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);

testListId = 'my-amazing-collection';
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);

testListId = '1001-dreams';
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);

testListTitle = 'PaTAtes FREGIdes';
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);

testListTitle = 'Són TRES peSSëtes';
testListId = getListIdFromListTitle(testListTitle);
console.log('[TEST] listTitle:', testListTitle, '>', testListId);
testListTitle = getListTitleFromListId(testListId);
console.log('[TEST] listId:', testListId, '>', testListTitle);

 */
