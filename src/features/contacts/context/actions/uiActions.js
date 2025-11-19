import { ACTION_TYPES } from "../actionTypes";

export const updateCurrentContact = (dispatch) => (field, value) => {
  dispatch({
    type: ACTION_TYPES.UPDATE_CURRENT_CONTACT,
    payload: { field, value },
  });
};

export const setEditingId = (dispatch) => (id) => {
  dispatch({
    type: ACTION_TYPES.SET_EDITING_ID,
    payload: id,
  });
};

export const setSelectedIds = (dispatch) => (ids) => {
  dispatch({
    type: ACTION_TYPES.SET_SELECTED_IDS,
    payload: ids,
  });
};

export const setSearch = (dispatch) => (value) => {
  dispatch({
    type: ACTION_TYPES.SET_SEARCH,
    payload: value,
  });
};

export const toggleModal = (dispatch) => (isOpen, type = null, data = null) => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_MODAL,
    payload: { isOpen, type, data },
  });
};

export const setErrors = (dispatch) => (errors) => {
  dispatch({
    type: ACTION_TYPES.SET_ERRORS,
    payload: errors,
  });
};

export const clearErrors = (dispatch) => () => {
  dispatch({ type: ACTION_TYPES.CLEAR_ERRORS });
};
