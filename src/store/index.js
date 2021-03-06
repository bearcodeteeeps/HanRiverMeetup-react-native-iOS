import { types } from 'mobx-state-tree';

import UserStore from './UserStore';
import RoomStore from './RoomStore';
import CommentStore from './CommentStore';
import ContentStore from './ContentStore';
import AlarmStore from './AlarmStore';
import serverInfo from '../configs';

const ACCESS_ENDPOINT = `${serverInfo.url}/access`;
const MEETING_HOST_ENDPOINT = `${serverInfo.url}/host/meeting`;
const MEETINGS_HOST_ENDPOINT = `${serverInfo.url}/host/meetings`;
const REQUEST_HOST_ENDPOINT = `${serverInfo.url}/host/requests`;
const COMMENT_ENDPOINT = `${serverInfo.url}/comm`;
const GUEST_ENDPOINT = `${serverInfo.url}/guest`;
const TIMELINE_ENDPOINT = `${serverInfo.url}/timeLine`;
const MY_PAGE_ENDPOINT = `${serverInfo.url}/mypage`;
const ALARM_ENDPOINT = `${serverInfo.url}/notificationLog`;
const EVENT_ENDPOINT = `${serverInfo.url}/event`;

const Store = types
  .model('Store', {
    userStore: types.optional(UserStore, UserStore.create()),
    roomStore: types.optional(RoomStore, RoomStore.create()),
    commentStore: types.optional(CommentStore, CommentStore.create()),
    contentStore: types.optional(ContentStore, ContentStore.create()),
    alarmStore: types.optional(AlarmStore, AlarmStore.create()),
  })
  .views(self => {
    const Fetch = async (method, url, params = undefined) => {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (self.userStore.user_id && self.userStore.hangangToken) {
        headers.hangang_token = self.userStore.hangangToken;
        headers.user_id = self.userStore.user_id;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }

      return response.json();
    };

    const loginValidate = params => Fetch('POST', `${ACCESS_ENDPOINT}/login`, params);
    const registUser = params => Fetch('POST', `${ACCESS_ENDPOINT}/registUser`, params);
    const registerComment = params => Fetch('POST', `${COMMENT_ENDPOINT}/comment`, params);
    const fetchRoomsBySeq = params =>
      Fetch('GET', `${MEETINGS_HOST_ENDPOINT}/week/${params.activity_seq}`);
    const fetchCommentByMeetingSeq = params =>
      Fetch('GET', `${COMMENT_ENDPOINT}/comments/${params.meeting_seq}`);
    const makeRoom = params => Fetch('POST', `${MEETING_HOST_ENDPOINT}`, params);
    const joinRoom = params => Fetch('POST', `${GUEST_ENDPOINT}/join`, params);
    const fetchTimeLinesByOffset = parmas => Fetch('POST', `${TIMELINE_ENDPOINT}/posts`, parmas);
    const makeTimeLineByInfos = params => Fetch('POST', `${TIMELINE_ENDPOINT}/post`, params);
    const fetchMyRoomsById = params =>
      Fetch('GET', `${MY_PAGE_ENDPOINT}/${params.user_id}/meetings`);
    const fetchRequestRoomById = params =>
      Fetch('GET', `${MY_PAGE_ENDPOINT}/${params.user_id}/join/meetings`);
    const fetchMatchCompletedById = params =>
      Fetch('GET', `${MY_PAGE_ENDPOINT}/${params.user_id}/matchings`);
    const fetchMeetingMemberBySeq = parmas =>
      Fetch('GET', `${REQUEST_HOST_ENDPOINT}/${parmas.meeting_seq}`);
    const matchWith = params => Fetch('POST', `${COMMENT_ENDPOINT}/match`, params);
    const fetchAlarmsById = params => Fetch('GET', `${ALARM_ENDPOINT}/${params.user_id}`);
    const fetchEvents = () => Fetch('GET', `${EVENT_ENDPOINT}/events`);

    return {
      loginValidate,
      registUser,
      registerComment,
      fetchRoomsBySeq,
      fetchCommentByMeetingSeq,
      makeRoom,
      joinRoom,
      fetchTimeLinesByOffset,
      makeTimeLineByInfos,
      fetchMyRoomsById,
      fetchRequestRoomById,
      fetchMeetingMemberBySeq,
      fetchMatchCompletedById,
      matchWith,
      fetchAlarmsById,
      fetchEvents,
    };
  });

export default Store;
