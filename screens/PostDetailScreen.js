// screens/PostDetailScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,           // ★ 추가
  KeyboardAvoidingView,
  Platform,
  Animated,            // ★ 슬라이드 애니메이션
  Alert
} from 'react-native';
import { useRoute ,useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view';      // ★ 댓글용 popover에도 사용
import PrizeIcon from '../assets/images/prize.png';

export default function PostDetailScreen() {

  const navigation = useNavigation();
  const route = useRoute();
  const { post, title, onDelete } = route.params || {};         // 안전하게 기본값 처리
  const [currentPost, setPost] = React.useState(post);
  console.log('전달된 board 값:', currentPost?.board);

  /* ------------------- 게시글 좋아요 ------------------- */
  const [postLiked, setPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(Number(post?.likes) || 0);

  /* ------------------- 댓글 메뉴 ------------------- */
  const [commentMenuVisible, setCommentMenuVisible] = useState(null);  // 열려 있는 댓글 id
  const commentIconRefs = useRef({});      // ★ 댓글별 아이콘 ref 저장용

  /* ------------------- 게시글 메뉴 ------------------- */
  const menuIconRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  
    /* ------------------- 입력창 ------------------- */
    const [inputVisible, setInputVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [replyTarget, setReplyTarget] = useState({ type: 'post', id: null }); // post / comment
    const [editMode, setEditMode] = useState(false); //지금 수정중인지
    const [editIds, setEditIds] = useState({ cId:null, rId:null }); //대상 ID
    const slideAnim = useRef(new Animated.Value(80)).current; // 0이면 보임

  /* ------------------- 예시 댓글 ------------------- */
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

  /* 댓글 + 대댓글 초기화 */
  const initialComments = post?.commentsList || sampleComments;
  const [commentList, setCommentList] = useState(
    initialComments.map((c) => ({
      ...c,
      liked: false,
      likeCount: c.likes || 0,
      replies: (c.replies || []).map((r) => ({
        ...r,
        liked: false,
        likeCount: r.likes || 0,
      })),
    }))
  );

  /* ------------------- 좋아요 토글 ------------------- */
  const togglePostLike = () => {
    setPostLiked((prev) => !prev);
    setPostLikes((prev) => prev + (postLiked ? -1 : 1));
  };

  const toggleCommentLike = (commentId) => {
    setCommentList((list) =>
      list.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likeCount: c.likeCount + (c.liked ? -1 : 1) }
          : c
      )
    );
  };

  const toggleReplyLike = (commentId, replyId) => {
    setCommentList((list) =>
      list.map((c) => {
        if (c.id !== commentId) return c;
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === replyId
              ? { ...r, liked: !r.liked, likeCount: r.likeCount + (r.liked ? -1 : 1) }
              : r
          ),
        };
      })
    );
  };

  /* ------------------- 입력창 열기 ------------------- */
  const openInput = (target) => {
    setReplyTarget(target);        // {type:'post'} or {type:'comment', id}
    setInputVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };
  /* ------------------- 전송 ------------------- */
  const sendComment = () => {
    const text = inputText.trim();
    if (!text) return;
    if (editMode && editIds.cId && !editIds.rId) {
      setCommentList(list =>
        list.map(c =>
          c.id == editIds.cId ? {...c, content:text } : c
        )
      );
      finishInput();
      return;
    }

    if (replyTarget.type === 'post') {
      /* 새 댓글 */
      const newComment = {
        id: Date.now().toString(),
        author: 'Me',
        content: text,
        date: new Date().toLocaleDateString('ko-KR'),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        liked: false,
        likeCount: 0,
        replies: [],
      };
      setCommentList((list) => [newComment, ...list]);
    } else {
      /* 대댓글 */
      setCommentList((list) =>
        list.map((c) =>
          c.id === replyTarget.id
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: `${replyTarget.id}-${Date.now()}`,
                    author: 'Me',
                    content: text,
                    date: new Date().toLocaleDateString('ko-KR'),
                    time: new Date().toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    liked: false,
                    likeCount: 0,
                  },
                ],
              }
            : c
        )
      );
    }

    /* 입력창 닫기 */
    // setInputText('');
    // Animated.timing(slideAnim, { toValue: 80, duration: 180, useNativeDriver: true }).start(() =>
    //   setInputVisible(false)
    // );
    finishInput();
  };

  /* ------------------- 입력창 닫기 & 상태 초기화 ------------------- */
const finishInput = () => {
  setInputText('');
  setEditMode(false);
  setEditIds({ cId: null, rId: null });     // 대상 초기화

  Animated.timing(slideAnim, {
    toValue: 80,          // 아래로 내려감
    duration: 180,
    useNativeDriver: true,
  }).start(() => setInputVisible(false));
};


  /* ------------------- 댓글 메뉴 핸들러 ------------------- */
  const handleCommentEdit = (id) => {
    console.log(`댓글 ${id} 수정`);
    setCommentMenuVisible(null);
    // 수정할 댓글 내용 찾아와서 입력창에 채우기
    const target = commentList.find(c => c.id === id);
    if (!target) return;
    setInputText(target.content);
    setEditMode(true);
    setEditIds({ cId: id, rId: null });
    setReplyTarget({ type:'comment', id: id }); //필요없을수도
    openInput({});
  };

  const handleCommentDelete = (commentId) => {
    console.log(`댓글 ${commentId} 삭제`);
    setCommentMenuVisible(null);
  
    Alert.alert(
      '삭제하시겠어요?',
      '삭제하면 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setCommentList((list) => 
              list.filter((c) => c.id !== commentId)
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  /* ------------------- 게시글 메뉴 핸들러 ------------------- */
  const handleEdit = () => {
    console.log('게시글 수정');
    setShowPopover(false);
    navigation.navigate('PostWrite',{
      mode: 'edit',
      postData : currentPost,
      onSave: (updated) => setPost(p => ({...p, ...updated})),
    });
  };

/* ---------------- 게시글 메뉴 핸들러 ---------------- */
const handleDelete = () => {
  setShowPopover(false);

  Alert.alert(
    '삭제하시겠어요?',
    '삭제하면 되돌릴 수 없습니다.',
    [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          // ① 목록 화면 state 갱신
          if (onDelete) onDelete(currentPost.id);

          // ② 이전 화면으로
          navigation.goBack();
        },
      },
    ],
    { cancelable: true }
  );
};


  /* ------------------- 게시글 헤더 ------------------- */
  const renderHeader = () => {
    const {
      author = '작성자',
      date = '2025/04/13',
      time = '12:30',
      board = '정보',
      detail = '상세',
      title: postTitle = '',
      content = '',
      image,
      comments = commentList.length,
    } = currentPost || {};

    const BOARD_COLORS = {
      'Q&A': '#93FFC9',
      정보: '#93DEFF',
      트로피: '#FFC107',
      인원모집: '#FF9393',
      All: '#607D8B',
    };
    const boardColor = BOARD_COLORS[board] || '#666';

    return (
      <View>
        <View style={styles.headerRow}>
          <Ionicons name="person-circle" size={36} color="#333" />
          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>{author}</Text>
            <Text style={styles.dateTimeText}>
              {date} {time}
            </Text>
          </View>
          <View style={styles.boardContainer}>
            <View style={[styles.labelBox, { backgroundColor: boardColor }]}>
              <Text style={styles.labelText}>{board}</Text>
            </View>
            <View style={[styles.labelBox, styles.detailBox]}>
              <Text style={styles.labelText}>{detail}</Text>
            </View>
          </View>
          <TouchableOpacity ref={menuIconRef} onPress={() => setShowPopover(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {postTitle && <Text style={styles.postTitle}>{postTitle}</Text>}

        <View style={styles.contentContainer}>
          {image && <Image source={image} style={styles.thumbnail} />}
          <Text style={styles.contentText}>{content}</Text>
        </View>

        <View style={styles.separator} />
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statsItem} onPress={togglePostLike}>
            <Feather
              name="thumbs-up"
              size={16}
              color={postLiked ? '#FBA834' : '#666'}
            />
            <Text style={styles.statsText}> 공감 {postLikes}</Text>
          </TouchableOpacity>
          {/* 댓글 – 본문 입력창 열기 */}
          <TouchableOpacity
            style={styles.statsItem}
            onPress={() => openInput({ type: 'post' })}  // ★
          >
            <Feather name="message-circle" size={16} color="#666" />
            <Text style={styles.statsText}> 댓글 {comments}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        {post?.board === '인원모집' && (
        <TouchableOpacity
          style={styles.applyBtn}             // ★ 스타일 3에서 정의
          onPress={() => console.log('신청하기')}
          activeOpacity={0.85}
        >
          <Text style={styles.applyText}>신청하기</Text>
        </TouchableOpacity>
      )}

      {post?.board === '트로피' && (
        <TouchableOpacity
          style={styles.trophyBtn}            // ★ 스타일 3에서 정의
          onPress={() => console.log('트로피 버튼')}
        >
          <Image source={PrizeIcon} style={styles.trophyIcon} />
        </TouchableOpacity>
      )}

      </View>
    );
  };

   /* ------------------- 댓글 렌더러 ------------------- */
   const renderCommentItem = ({ item: cmt }) => {
    if (!commentIconRefs.current[cmt.id]) commentIconRefs.current[cmt.id] = React.createRef();
    const anchorRef = commentIconRefs.current[cmt.id];

    return (
      <View style={styles.commentContainer}>
        {/* 댓글 상단 */}
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
            {/* ---- “대댓글 입력” 버튼 ---- */}
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => openInput({ type: 'comment', id: cmt.id })}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
            </TouchableOpacity>
            {/* ---- 메뉴 ---- */}
            <TouchableOpacity ref={anchorRef} onPress={() => setCommentMenuVisible(cmt.id)}>
              <Ionicons name="ellipsis-vertical" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.commentText}>{cmt.content}</Text>
        <Text style={styles.commentDateTime}>
          {cmt.date} {cmt.time}
        </Text>

        {/* 댓글 메뉴 Popover */}
        {commentMenuVisible === cmt.id && (
          <Popover
            isVisible
            from={anchorRef}
            onRequestClose={() => setCommentMenuVisible(null)}
            placement="bottom"
          >
            <View style={styles.popoverContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentEdit(cmt.id)}>
                <Ionicons name="pencil" size={16} color="#333" />
                <Text style={styles.menuText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentDelete(cmt.id)}>
                <Ionicons name="trash" size={16} color="#333" />
                <Text style={styles.menuText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Popover>
        )}

        {/* ------------ 대댓글 ------------ */}
        {cmt.replies.map((reply) => (
          <View style={styles.replyContainer} key={reply.id}>
            <View style={styles.replyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-undo-outline" size={16} color="#666" />
                <Ionicons
                  name="person-circle"
                  size={32}
                  color="#333"
                  style={styles.replyProfile}
                />
                <Text style={styles.replyAuthor}>{reply.author}</Text>
              </View>
              <View style={styles.commentIconRow}>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => toggleReplyLike(cmt.id, reply.id)}
                >
                  <Feather
                    name="thumbs-up"
                    size={14}
                    color={reply.liked ? '#FBA834' : '#666'}
                  />
                  <Text style={styles.iconText}>{reply.likeCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.commentText}>{reply.content}</Text>
            <Text style={styles.commentDateTime}>
              {reply.date} {reply.time}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  /* ------------------- 반환 ------------------- */
  return (
    <View style={styles.container}>
      <Header showBackButton leftContent={title} />

      <FlatList
        data={commentList}
        keyExtractor={(item) => item.id}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />


      {/* ---------------- 입력창 ---------------- */}
      {inputVisible && (
        <Animated.View
          style={[
            styles.inputBarWrapper,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TextInput
            style={styles.inputField}
            placeholder="작성내용을 적어주세요"
            placeholderTextColor="#9E9E9E"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={sendComment}>
            <Ionicons name="send" size={22} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      )}


      {/* ----------- 본문 Popover ----------- */}
      <Popover
        isVisible={showPopover}
        from={menuIconRef}
        onRequestClose={() => setShowPopover(false)}
        placement="bottom"
      >
        <View style={styles.popoverContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
            <Ionicons name="pencil" size={16} color="#333" />
            <Text style={styles.menuText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color="#333" />
            <Text style={styles.menuText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </Popover>


    </View>
  );
}

/* ------------------- 스타일 ------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  listContent: { padding: 16 },

  /* ---- 헤더 ---- */
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  authorContainer: { marginLeft: 8 },
  authorText: { fontSize: 14, fontWeight: '600', color: '#333' },
  dateTimeText: { fontSize: 12, color: '#999' },
  boardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  labelBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8 },
  detailBox: { backgroundColor: '#CDCDCD' },
  labelText: { fontSize: 12, color: '#000' },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  contentContainer: { marginBottom: 16 },
  thumbnail: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover', marginBottom: 8 },
  contentText: { fontSize: 14, color: '#333', lineHeight: 20 },

  separator: { height: 1, backgroundColor: '#eaeaea' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  statsItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  statsText: { fontSize: 12, color: '#666', marginLeft: 4 },

  /* ---- 댓글 ---- */
  commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentProfileAndName: { flexDirection: 'row', alignItems: 'center' },
  commentAuthor: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#333' },
  commentIconRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 12, color: '#666', marginLeft: 4 },
  commentText: { fontSize: 14, color: '#333', marginVertical: 6 },
  commentDateTime: { fontSize: 12, color: '#999', marginTop: 4 },

  /* ---- 대댓글 ---- */
  replyContainer: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, marginTop: 8 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  replyProfile: { marginHorizontal: 4 },
  replyAuthor: { fontSize: 13, fontWeight: '600', color: '#333' },

  /* ---- 입력창 ---- */
  inputBarWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#0A185B', // 진한 남색
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    marginRight: 8,
  },

  /* ---- Popover ---- */
  popoverContainer: {
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
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  menuText: { fontSize: 14, color: '#333', marginLeft: 6 },
   /* ----- 트로피 버튼 ----- */
 trophyBtn: {
   position: 'absolute',
   right: 20,
   bottom: 46,           
   width: 56,
   height: 56,
   borderRadius: 28,
   backgroundColor: '#FFF',
   justifyContent: 'center',
   alignItems: 'center',
   elevation: 4,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.15,
   shadowRadius: 2,
 },
 trophyIcon: { width: 32, height: 32, resizeMode: 'contain' },

   /* ----- 인원모집 “신청하기” 버튼 ----- */
 applyBtn: {
   position: 'absolute',
   right: 20,
   bottom: 40,
   paddingHorizontal: 20,
   height: 48,
   borderRadius: 24,
   backgroundColor: '#FBA834',
   justifyContent: 'center',
   alignItems: 'center',
   zIndex: 5,
   elevation: 4,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 1 },
   shadowOpacity: 0.15,
   shadowRadius: 2,
 },
 applyText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});
