// screens/PostDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export default function PostDetailScreen() {
  const route = useRoute();
  const { post, title } = route.params; // post: 게시글 정보, title: 커뮤니티 이름(헤더 표시용)
  
  // 메뉴(모달) 표시 상태
  const [menuVisible, setMenuVisible] = useState(false);
  // 댓글 메뉴 모달 상태: 열려 있는 댓글의 id (없으면 null)
  const [commentMenuVisible, setCommentMenuVisible] = useState(null);

  const [postLiked, setPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(Number(likes) || 0);

  //  게시판별 라벨 색상 맵
  const BOARD_COLORS = {
    'Q&A': '#93FFC9',       // 초록
    '정보': '#93DEFF',      // 파랑
    '트로피': '#FFC107',    // 노랑
    '인원모집': '#FF9393',  // 분홍
    All: '#607D8B',         // 회색
  };

  // 예시 댓글 데이터 (실제 데이터는 API나 로컬 스토리지에서 받아올 수 있음)
  const sampleComments = [
    {
      id: '1',
      author: 'Alice',
      content: '정말 멋진 포스트예요!',
      date: '2025/04/13',
      time: '13:45',
      likes: 3,
      replies: [
        {
          id: '1-1',
          author: '댓글러',
          content: '저도 동감합니다!',
          date: '2025/03/22',
          time: '14:00',
          likes: 1,
        },
      ],
    },
    {
      id: '2',
      author: 'Bob',
      content: '유익한 정보 감사합니다!',
      date: '2025/04/13',
      time: '14:05',
      likes: 1,
      replies: [],
    },
  ];

  // 게시글 데이터 구조 예시 (post의 title은 postTitle으로 aliasing)
  const {
    author = '작성자',
    date = '2025-04-13',
    time = '12:30',
    board = '정보',
    detail = '스카이다이빙',
    content = '내용',
    title: postTitle = '',
    image,
    likes = 0,
    comments = 0,
    // 예시 댓글 데이터로 대체 (나중에 실제 데이터를 사용)
    commentsList = sampleComments,
  } = post || {};

  const boardColor = BOARD_COLORS[board] || '#666';

  // 수정 버튼 클릭 시 처리
  const handleEdit = () => {
    console.log('수정 버튼 눌림');
    // TODO: 수정 로직 구현 (예: 수정 페이지 이동)
    setMenuVisible(false);
  };

  // 삭제 버튼 클릭 시 처리
  const handleDelete = () => {
    console.log('삭제 버튼 눌림');
    // TODO: 삭제 로직 구현 (예: 삭제 API 호출)
    setMenuVisible(false);
  };

  // 댓글 수정/삭제 처리 (실제 로직은 여기에 추가)
  const handleCommentEdit = (commentId) => {
    console.log(`[댓글 ${commentId}] 수정`);
    setCommentMenuVisible(null);
  };

  const handleCommentDelete = (commentId) => {
    console.log(`[댓글 ${commentId}] 삭제`);
    setCommentMenuVisible(null);
  };

  // 댓글 데이터 상태 초기화
const [commentList, setCommentList] = useState(
    commentsList.map(c => ({
      ...c,
      liked: false,
      likeCount: c.likes || 0,
    }))
  );
  
  // 댓글 좋아요 토글 함수
  const toggleCommentLike = (commentId) => {
    console.log("toggleCommentLike called for comment", commentId);
    setCommentList(prevComments =>
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const newLiked = !comment.liked;
          const newLikeCount = newLiked ? comment.likeCount + 1 : comment.likeCount - 1;
          return { ...comment, liked: newLiked, likeCount: newLikeCount };
        }
        return comment;
      })
    );
  };

  // 본문 좋아요 토글 함수
const togglePostLike = () => {
    if (postLiked) {
      setPostLikes(prev => prev - 1);
      setPostLiked(false);
    } else {
      setPostLikes(prev => prev + 1);
      setPostLiked(true);
    }
  };


  // FlatList의 ListHeaderComponent에 넣을 상단 콘텐츠 (게시글 정보 영역)
  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        {/* 왼쪽: 프로필 아이콘 */}
        <Ionicons
          name="person-circle"
          size={36}
          color="#333"
          style={styles.profileIcon}
        />

        {/* 작성자 및 날짜/시간 */}
        <View style={styles.authorContainer}>
          <Text style={styles.authorText}>{author}</Text>
          <Text style={styles.dateTimeText}>{date} {time}</Text>
        </View>

        {/* board와 detail 라벨 */}
        <View style={styles.boardContainer}>
          <View style={[styles.labelBox, { backgroundColor: boardColor }]}>
            <Text style={styles.labelText}>{board}</Text>
          </View>
          <View style={[styles.labelBox, styles.detailBox]}>
            <Text style={styles.labelText}>{detail}</Text>
          </View>
        </View>

        {/* 오른쪽: 메뉴 아이콘 */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color="#666"
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 게시글 제목 */}
      {postTitle.length > 0 && (
        <Text style={styles.postTitle}>{postTitle}</Text>
      )}

      {/* 본문 이미지와 내용 */}
      <View style={styles.contentContainer}>
        {image && <Image source={image} style={styles.thumbnail} />}
        <Text style={styles.contentText}>{content}</Text>
      </View>

      {/* 좋아요 및 댓글 영역 위 아래 구분선 */}
      <View>
        <View style={styles.separator} />
        <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statsItem} onPress={togglePostLike}>
                <Feather name="thumbs-up" size={16} color={postLiked ? '#FBA834' : '#666'} />
                <Text style={styles.statsText}> 공감  {postLikes}</Text>
            </TouchableOpacity>

          <View style={styles.statsItem}>
            <Feather name="message-circle" size={16} color="#666" />
            <Text style={styles.statsText}> 댓글  {comments}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    </View>
  );

  // 댓글 아이템 렌더링 함수
  const renderCommentItem = ({ item: cmt }) => (
    <View style={styles.commentContainer}>
      {/* 상단 영역: 왼쪽 - 프로필 아이콘과 작성자, 오른쪽 - 좋아요와 메뉴 아이콘 */}
      <View style={styles.commentHeader}>
        <View style={styles.commentProfileAndName}>
          <Ionicons name="person-circle" size={36} color="#333" />
          <Text style={styles.commentAuthor}>{cmt.author}</Text>
        </View>

        <View style={styles.commentIconRow}>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => toggleCommentLike(cmt.id)}>
            <Feather name="thumbs-up" size={16} color={cmt.liked ? '#FBA834' : '#666'} />
            <Text style={styles.iconText}>{cmt.likeCount}</Text>
          </TouchableOpacity>

           {/* 추가: 댓글(답글) 아이콘 */}
            <TouchableOpacity style={styles.iconWrapper}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            {/* 필요 시 숫자나 텍스트 추가 가능 */}
            </TouchableOpacity>
          <TouchableOpacity onPress={() => setCommentMenuVisible(cmt.id)}>
            <Ionicons name="ellipsis-vertical" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 댓글 내용 */}
      <Text style={styles.commentText}>{cmt.content}</Text>

      {/* 하단 영역: 날짜와 시간 */}
      <Text style={styles.commentDateTime}>
        {cmt.date} {cmt.time}
      </Text>

      {/* 댓글 메뉴 모달 (해당 댓글에 대해서만 보임) */}
      {commentMenuVisible === cmt.id && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setCommentMenuVisible(null)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setCommentMenuVisible(null)}
          >
            {/* 모달 팝오버: 메뉴 버튼 옆에 뜨도록 절대 위치 지정 */}
            <View style={styles.commentModalContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleCommentEdit(cmt.id)}
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color="#333"
                  style={styles.modalIcon}
                />
                <Text style={styles.modalButtonText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleCommentDelete(cmt.id)}
              >
                <Ionicons
                  name="trash"
                  size={16}
                  color="#333"
                  style={styles.modalIcon}
                />
                <Text style={styles.modalButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header showBackButton leftContent={title} />
      <FlatList
        data={commentList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />

      {/* 수정/삭제 메뉴 모달 (메뉴 아이콘 옆에 위치) */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.popoverContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Ionicons
                name="pencil"
                size={16}
                color="#333"
                style={styles.menuIconItem}
              />
              <Text style={styles.menuText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Ionicons
                name="trash"
                size={16}
                color="#333"
                style={styles.menuIconItem}
              />
              <Text style={styles.menuText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  /***** 헤더 영역 *****/
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    marginRight: 8,
  },
  authorContainer: {
    flexDirection: 'column',
    marginRight: 12,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#999',
  },
  boardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  labelBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  detailBox: {
    backgroundColor: '#CDCDCD',
  },
  labelText: {
    fontSize: 12,
    color: '#000',
  },
  menuIcon: {
    marginLeft: 8,
  },
  /***** 게시글 제목 *****/
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  /***** 본문 영역 *****/
  contentContainer: {
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  /***** 좋아요 + 댓글 영역 *****/
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginLeft: 20,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eaeaea',
  },
 /********** 댓글 아이템 **********/
 commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentProfileAndName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAuthor: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 6,
  },
  commentDateTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  /********** 댓글 메뉴 모달 **********/
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  commentModalContainer: {
    position: 'absolute',
    // 아래 값들은 메뉴 아이콘 위치와 댓글 아이템 레이아웃에 따라 조정하세요.
    top: 490,  
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalIcon: {
    marginRight: 8,
  },
  modalButtonText: {
    fontSize: 14,
    color: '#333',
  },
  /***** 모달 영역 *****/
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  popoverContainer: {
    position: 'absolute',
    top: 115,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuIconItem: {
    marginRight: 8,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
  },
});
