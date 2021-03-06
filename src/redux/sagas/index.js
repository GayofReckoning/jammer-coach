import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import categorySaga from './categorySaga';
import skillSaga from './skillSaga';
import skaterSaga from './skaterSaga';
import addSkillSaga from './addSkillSaga'
import curriculumSaga from './curriculumSaga';
import skillCategorySaga from './skillCategorySaga';
import updateSkillSaga from './updateSkillSaga';
import profileSaga from './profileSaga';
import footageSaga from './footageSaga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    userSaga(),
    categorySaga(),
    skillSaga(),
    skaterSaga(),
    addSkillSaga(),
    curriculumSaga(),
    skillCategorySaga(),
    updateSkillSaga(),
    profileSaga(),
    footageSaga(),
  ]);
}
