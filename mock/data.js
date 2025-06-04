/* ------------------------------------------------------------------
   src/mock/data.js
   모든 화면이 공통으로 import 해서 쓰는 예시(목업) 데이터 모음
------------------------------------------------------------------- */

/** -----------------------------------------------------------------
 *  1. 커뮤니티 → 글(Post) 목록
 *     key  : communityId   (예: extreme-sports)
 *     value: Post[]        (아래 타입 참고)
 *
 *  type Post = {
 *    id: string;          // 고유 ID
 *    board: '정보' | 'Q&A' | '인원모집' | '트로피';
 *    detail: string;      // 소분류
 *    title: string;
 *    author: string;
 *    image: any   | null; // require(...) or {uri: ...}
 *    likes: number;
 *    comments: number;    // 댓글 수
 *    date: string;        // YYYY/MM/DD
 *    time: string;        // HH:mm
 *  }
 * ---------------------------------------------------------------- */
export const mockPosts = {
    'extreme-sports': [
      {
        id: 'es-1',
        board: '정보',
        detail: '수상스키',
        title: '수상스키 장소 추천이요',
        author: '나나',
        image: null,
        likes: 10,
        comments: 5,
        date: '2025/04/13',
        time: '18:30',
      },
      {
        id: 'es-2',
        board: 'Q&A',
        detail: '번지점프',
        title: '번지점프 어디가 최고일까요?',
        author: '키키',
        image: require('../assets/images/bungee.png'),
        likes: 3,
        comments: 2,
        date: '2025/04/13',
        time: '17:15',
      },
      {
        id: 'es-3',
        board: '트로피',
        detail: '스카이다이빙',
        title: '스카이다이빙 도전 성공했습니다!',
        author: '철수',
        image: require('../assets/images/prize.png'),
        likes: 15,
        comments: 7,
        date: '2025/04/14',
        time: '09:20',
      },
    ],
  
    'indoor-activities': [
      {
        id: 'in-1',
        board: '정보',
        detail: '클라이밍',
        title: '홍대 실내 클라이밍장 후기',
        author: '지민',
        image: null,
        likes: 6,
        comments: 1,
        date: '2025/03/30',
        time: '21:05',
      },
    ],
  
    study: [
      {
        id: 'st-1',
        board: '인원모집',
        detail: '자격증',
        title: '정보보안기사 스터디 모집',
        author: '혜린',
        image: null,
        likes: 2,
        comments: 3,
        date: '2025/04/01',
        time: '10:00',
      },
    ],
  
    health: [
      {
        id: 'he-1',
        board: 'Q&A',
        detail: '식단',
        title: '벌크업 식단 어떻게 짜세요?',
        author: '헬린이',
        image: null,
        likes: 8,
        comments: 4,
        date: '2025/02/11',
        time: '14:40',
      },
    ],
  };
  
  /** -----------------------------------------------------------------
   *  2. 글 → 댓글(Comment) & 대댓글(Reply) 목록
   *     key  : postId   (mockPosts 안의 id 와 매칭)
   *     value: Comment[]
   *
   *  type Comment = {
   *    id: string;
   *    author: string;
   *    content: string;
   *    date: string;
   *    time: string;
   *    likes: number;
   *    replies: Reply[];
   *  }
   *  type Reply = Comment & { }   // 구조 동일
   * ---------------------------------------------------------------- */
  export const mockComments = {
    'es-1': [
      {
        id: 'c1',
        author: 'Alice',
        content: '정말 멋진 포스트예요!',
        date: '2025/04/13',
        time: '13:45',
        likes: 3,
        replies: [
          {
            id: 'c1-r1',
            author: '댓글러',
            content: '저도 동감합니다!',
            date: '2025/04/13',
            time: '14:00',
            likes: 1,
            replies: [],
          },
        ],
      },
      {
        id: 'c2',
        author: 'Bob',
        content: '유익한 정보 감사합니다!',
        date: '2025/04/13',
        time: '14:05',
        likes: 1,
        replies: [],
      },
    ],
  
    'es-2': [],          // 댓글 없음 예시
    'es-3': [],
  
    'in-1': [
      {
        id: 'c3',
        author: 'MJ',
        content: '다음에 같이 가요~',
        date: '2025/03/30',
        time: '22:10',
        likes: 0,
        replies: [],
      },
    ],
  
    'st-1': [],
    'he-1': [],
  };
  
  /** -----------------------------------------------------------------
   *  3. 예시 트로피 목록 (PostWriteScreen 용)
   * ---------------------------------------------------------------- */
  export const sampleTrophies = [
    {
      id: 't1',
      category: '해보고싶다',
      title: '제주도 여행',
      createdAt: '2024.06.02',
      achievedAt: '언젠가',
    },
    {
      id: 't2',
      category: '배우고싶다',
      title: '기타배우기',
      createdAt: '2024.06.02',
      achievedAt: '언젠가',
    },
    {
      id: 't3',
      category: '마라톤 완주하기',
      title: '일본어 배우기',
      createdAt: '2024.06.02',
      achievedAt: '언젠가',
    },
  ];
  