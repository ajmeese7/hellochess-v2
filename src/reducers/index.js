import {combineReducers} from 'redux';
import {reducer as notifications} from 'react-notification-system-redux';
import { reducer as formReducer } from 'redux-form'

import rooms from './rooms_reducer';
import AuthReducer from './auth_reducer';
import newGameOptions from './new_game_reducer';

import {SELECTED_ROOM} from '../actions/types';

function activeThread (state = 'Global', action) {
    switch(action.type) {
        case SELECTED_ROOM:
            return action.payload;
        default:
            return state;
    }
}

function openThreads(state = {}, action) {
    let obj = null, newState = null;
    let roomName = null;
    switch(action.type) {
        case 'user-room-joined':
            const users = action.payload.users;
            roomName = action.payload.room.name;
            obj = {...state[roomName], users};
            return {...state, [roomName]: obj};
        case 'user-room-left':
            roomName = action.payload.name;
            const user = action.payload.user;
            newState = Object.assign({}, state);
            newState[roomName].users = newState[roomName].users.filter((member) => {
                return user.user._id !== member._id;
            });
            return newState;
        case 'joined-room':
            return {...state, [action.payload.room.name]: action.payload };
        case 'left-room':
            newState = Object.assign({}, state);
            delete newState[action.payload];
            return newState;
        case 'receive-message':
            const messages = [...state[action.payload.thread].messages, action.payload];
            obj = {...state[action.payload.thread], messages};
            return {...state, [action.payload.thread]: obj };
        case 'sit-down-white':
            newState = Object.assign({}, state);
            newState[action.payload.thread].white = action.payload.room;
            return newState;
        case 'sit-down-black':
            newState = Object.assign({}, state);
            newState[action.payload.thread].black = action.payload.room;
            return newState;
        case 'sit-down-gold':
            newState = Object.assign({}, state);
            newState[action.payload.thread].gold = action.payload.room;
            return newState;
        case 'sit-down-red':
            newState = Object.assign({}, state);
            newState[action.payload.thread].red = action.payload.room;
            return newState;
        case 'up-white':
            newState = Object.assign({}, state);
            delete newState[action.payload.name].white;
            return newState;
        case 'up-black':
            newState = Object.assign({}, state);
            delete newState[action.payload.name].black;
            return newState;
        case 'up-gold':
            newState = Object.assign({}, state);
            delete newState[action.payload.name].gold;
            return newState;
        case 'up-red':
            newState = Object.assign({}, state);
            delete newState[action.payload.name].red;
            return newState;
        default:
            return state;
    }
}

function connection(state = {status: false, error: false}, action) {
    switch(action.type) {
        case 'duplicate-login':
            return {status: false, error: true};
        case 'disconnect':
            return {status: false};
        case 'connected':
            return {status: true};
        default:
            return state;
    }
}

function activeGame(state=false, action) {
    switch(action.type) {
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    connection,
    notifications,  //notification-center lib
    rooms,      //A list of all available Chat Rooms
    activeThread,
    openThreads,
    newGameOptions,
    auth: AuthReducer,
    form: formReducer,
});

export default rootReducer;
