import profileImg from "../assets/한로로프로필사진.jpg";
import oneAlbum from "../assets/입춘.jpg";
import twoAlbum from "../assets/거울.jpg";
import threeAlbum from "../assets/비틀비틀 짝짜꿍.jpg";
import fourAlbum from "../assets/당밤나밤.jpg";
import fiveAlbum from "../assets/정류장.jpg";
import sixAlbum from "../assets/자처.jpg";
import seveenAlbum from "../assets/이상비행.jpg";
import ehatAlbum from "../assets/하루살이.jpg";
import nineAlbum from "../assets/먹이사슬.jpg";
import tenAlbum from "../assets/생존법.jpg";
import tenOnwAlbum from "../assets/집.jpg";
import tenTwoAlbum from "../assets/나침반.jpg";
import tenThreeAlbum from "../assets/도망.jpg";
import tenForeAlbum from "../assets/자몽살구클럽.jpg";

export const artistData = {
  name: "한로로",
  differentName: "한지수, HANRORO",
  company: "authentic",
  debutDate: "2022년 3월 14일",
  genre: "인디, 락",
  bio: "팬들에게 사랑받는 아티스트",
  imageUrl: profileImg,
  albums: [
    {
      id: "14",
      title: "자몽살구클럽",
      releaseDate: "2025-08-04",
      coverUrl: tenForeAlbum,
      tracks: [
        { title: "내일에서 온 티켓", duration: "3:10" },
        { title: "용의자", duration: "3:21" },
        { title: "갈림길", duration: "3:35" },
        { title: "0+0", duration: "3:12" },
        { title: "__에게", duration: "2:18" },
        { title: "시간을 달리네", duration: "3:56" },
        { title: "도망", duration: "3:08" },
      ],
    },
    {
      id: "13",
      title: "도망",
      releaseDate: "2025-07-06",
      coverUrl: tenThreeAlbum,
      tracks: [],
    },
    {
      id: "12",
      title: "나침반",
      releaseDate: "2024-10-29",
      coverUrl: tenTwoAlbum,
      tracks: [],
    },
    {
      id: "11",
      title: "집",
      releaseDate: "2024-05-28",
      coverUrl: tenOnwAlbum,
      tracks: [
        { title: "귀가", duration: "1:50" },
        { title: "ㅈㅣㅂ", duration: "3:51" },
        { title: "먹이사슬", duration: "3:23" },
        { title: "놀이터", duration: "4:04" },
        { title: "재", duration: "3:56" },
        { title: "생존법", duration: "3:37" },
        { title: "보수공사", duration: "3:25" },
      ],
    },
    {
      id: "10",
      title: "생존법",
      releaseDate: "2024-05-16",
      coverUrl: tenAlbum,
      tracks: [],
    },
    {
      id: "9",
      title: "먹이사실",
      releaseDate: "2024-04-30",
      coverUrl: nineAlbum,
      tracks: [],
    },
    {
      id: "8",
      title: "하루살이",
      releaseDate: "2023-12-26",
      coverUrl: ehatAlbum,
      tracks: [],
    },
    {
      id: "7",
      title: "이상비행",
      releaseDate: "2023-08-29",
      coverUrl: seveenAlbum,
      tracks: [
        { title: "이상비행", duration: "2:35" },
        { title: "해초", duration: "3:45" },
        { title: "화해", duration: "3:41" },
        { title: "금붕어", duration: "3:32" },
        { title: "자처", duration: "4:32" },
        { title: "사랑하게 될 거야", duration: "2:45" },
      ],
    },
    {
      id: "6",
      title: "자처",
      releaseDate: "2023-04-21",
      coverUrl: sixAlbum,
      tracks: [],
    },
    {
      id: "5",
      title: "정류장",
      releaseDate: "2023-01-04",
      coverUrl: fiveAlbum,
      tracks: [],
    },
    {
      id: "4",
      title: "당신의 밤은 나의 밤과 같습니까 (feat. 숨비)",
      releaseDate: "2022-10-25",
      coverUrl: fourAlbum,
      tracks: [],
    },
    {
      id: "3",
      title: "비틀비틀 짝짜꿍",
      releaseDate: "2022-09-04",
      coverUrl: threeAlbum,
      tracks: [],
    },
    {
      id: "2",
      title: "거울",
      releaseDate: "2022-06-18",
      coverUrl: twoAlbum,
      tracks: [],
    },
    {
      id: "1",
      title: "입춘",
      releaseDate: "2022-03-14",
      coverUrl: oneAlbum,
      tracks: [],
    },
  ],
};
