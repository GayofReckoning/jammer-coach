import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

//this saga gets fired with every 'GET_SKILL_CATAGORY' action
function* getJunction(){
    try {
       const response = yield axios.get('/api/category/skill');
        yield put({ type: 'PUT_SKILL_CATEGORY', payload: response.data });
    }  catch (error) {
        console.log('Error with skill_category GET:', error);
    }
}

function* postJunction(action){
    try{
        yield axios.post('/api/skill/category', action.payload);
    }catch (error) {
        console.log('Error with skill_category POST:', error);
    }
}

function* deleteJunction(action){
    try{
        yield axios.delete('/api/skill/category', action.payload);
    }catch (error) {
        console.log('Error with skill_category DELETE:', error);
    }
}



function* skillCategorySaga() {
  yield takeLatest('GET_JUNCTION', getJunction);
  yield takeLatest('POST_JUNCTION', postJunction);
  yield takeLatest('DELTE_JUNCTION', deleteJunction);
}

export default skillCategorySaga;