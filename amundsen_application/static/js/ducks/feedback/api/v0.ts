import axios from 'axios';

export function submitFeedback(data: FormData) {
  return axios({
    data,
    method: 'post',
    url: '/explore/api/mail/v0/feedback',
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
