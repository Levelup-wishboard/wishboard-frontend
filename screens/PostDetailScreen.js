import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Animated, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOARD_COLORS = {
  정보: '#93DEFF',
  트로피: '#FFC107',
  'Q&A': '#93FFC9',
  인원모집: '#FF9393',
  All: '#607D8B',
};
const toColorKey = (raw = '') => raw?.replace(/\s+/g, '');

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const { postId } = useRoute().params;

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  // 댓글 입력
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [replyTarget, setReplyTarget] = useState({ type: 'post', id: null }); // type: post or comment
  const [editMode, setEditMode] = useState(false);
  const [editIds, setEditIds] = useState({ cId: null, rId: null });
  const slideAnim = useRef(new Animated.Value(80)).current;

  const menuIconRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState(null);
  const commentIconRefs = useRef({});

  // 게시글/댓글/대댓글 불러오기
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('토큰이 없습니다! 로그인 상태를 확인하세요');

      // 게시글
      const postRes = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!postRes.ok) throw new Error('게시글 불러오기 실패');
      const postData = await postRes.json();

      // 댓글
      const commentsRes = await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!commentsRes.ok) throw new Error('댓글 불러오기 실패');
      const commentsData = await commentsRes.json();

      setPost(postData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (e) {
      setError('불러오기 실패: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', padding: 16 }}>{error}</Text>;
  if (!post) return null;

  // ---- 좋아요 API 연동 ----
  const togglePostLike = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '게시글 좋아요 실패');
      }
      await fetchData();
    } catch (e) {
      alert(e.message || '게시글 좋아요 오류');
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:8080/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '댓글 좋아요 실패');
      }
      await fetchData();
    } catch (e) {
      alert(e.message || '댓글 좋아요 오류');
    }
  };

  const toggleReplyLike = async (commentId, replyId) => {
    await toggleCommentLike(replyId);
  };

  // ---- 입력창 열기/닫기 ----
  const openInput = (target) => {
    setReplyTarget(target);
    setInputVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };
  const finishInput = () => {
    setInputText('');
    setEditMode(false);
    setEditIds({ cId: null, rId: null });
    Animated.timing(slideAnim, {
      toValue: 80,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setInputVisible(false));
  };

  // ---- 댓글/대댓글 등록 (API 연동) ----
  const sendComment = async () => {
    const text = inputText.trim();
    if (!text) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      let body = { content: text };
      if (replyTarget.type === 'comment' && replyTarget.id) {
        body.parentId = replyTarget.id;
      }
      const res = await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || '댓글 작성 실패');
      }
      await fetchData();
      finishInput();
    } catch (e) {
      alert(e.message || '댓글 작성 오류');
    } finally {
      setLoading(false);
    }
  };

  // ---- 댓글/대댓글 삭제 (API 연동) ----
 const handleCommentDelete = (commentId) => {
  console.log('handleCommentDelete 실행!', commentId);
  setCommentMenuVisible(null);

  setTimeout(() => {
    if (Platform.OS === 'web') {
      // 웹은 window.confirm
      if (window.confirm('삭제하면 되돌릴 수 없습니다.\n정말 삭제하시겠어요?')) {
        // 삭제 로직 실행!
        (async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            const url = `http://localhost:8080/api/comments/${commentId}`;
            console.log('댓글 삭제 fetch 호출:', url);
            const res = await fetch(url, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
            });
            const text = await res.text();
            console.log('댓글 삭제 fetch 응답:', res.status, text);
            if (!res.ok) {
              window.alert(text || '댓글 삭제 실패');
              return;
            }
            await fetchData();
          } catch (e) {
            window.alert(e.message || '댓글 삭제 오류');
          }
        })();
      }
    } else {
      // 앱은 Alert.alert
      Alert.alert(
        '삭제하시겠어요?',
        '삭제하면 되돌릴 수 없습니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => {
              (async () => {
                try {
                  const token = await AsyncStorage.getItem('accessToken');
                  const url = `http://localhost:8080/api/comments/${commentId}`;
                  const res = await fetch(url, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  const text = await res.text();
                  if (!res.ok) {
                    alert(text || '댓글 삭제 실패');
                    return;
                  }
                  await fetchData();
                } catch (e) {
                  alert(e.message || '댓글 삭제 오류');
                }
              })();
            },
          },
        ],
        { cancelable: true }
      );
    }
  }, 250);
};




  // ---- 댓글 메뉴 ----
  const handleCommentEdit = (id) => {
    setCommentMenuVisible(null);
    const target = comments.find(c => c.commentId === id);
    if (!target) return;
    setInputText(target.content);
    setEditMode(true);
    setEditIds({ cId: id, rId: null });
    setReplyTarget({ type: 'comment', id });
    openInput({});
  };

  // ---- 게시글 메뉴 ----
  const handleEdit = () => {
    setShowPopover(false);
    navigation.navigate('PostWrite', {
      mode: 'edit',
      postId: post.postId,
      postData: post,
      defaultBoardTab: post.communityType,
      diversity: post.diversity
    });
  };

  const deletePost = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        alert('삭제 완료!');
        navigation.goBack();
      } else {
        const err = await res.json().catch(() => ({}));
        alert('삭제 실패: ' + (err.message || res.status));
      }
    } catch (e) {
      alert('삭제 실패: ' + (e?.message || '오류'));
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('삭제하면 되돌릴 수 없습니다.\n정말 삭제하시겠어요?')) {
        deletePost();
      }
      return;
    }
    Alert.alert(
      '삭제하시겠어요?',
      '삭제하면 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: deletePost },
      ],
      { cancelable: true }
    );
  };

  // ---- 헤더 아래 게시글 info 렌더 ----
  const renderHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <Ionicons name="person-circle" size={36} color="#333" />
        <View style={styles.authorContainer}>
          <Text style={styles.authorText}>{post.authorNickname || '작성자'}</Text>
          <Text style={styles.dateTimeText}>
            {post.createdAt?.slice(0, 10) || ''}
          </Text>
        </View>
        <View style={styles.boardContainer}>
          <View style={[
            styles.labelBox,
            { backgroundColor: BOARD_COLORS[toColorKey(post.communityType)] || '#CDCDCD' }
          ]}>
            <Text style={styles.labelText}>{post.communityType}</Text>
          </View>
          <View style={[styles.labelBox, styles.detailBox]}>
            <Text style={styles.labelText}>{post.type}</Text>
          </View>
        </View>
        <TouchableOpacity ref={menuIconRef} onPress={() => setShowPopover(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.postTitle}>{post.title}</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statsItem} onPress={togglePostLike}>
          <Feather
            name="thumbs-up"
            size={16}
            color={post.liked ? '#FBA834' : '#666'}
          />
          <Text style={styles.statsText}> 공감 {post.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statsItem} onPress={() => openInput({ type: 'post' })}>
          <Feather name="message-circle" size={16} color="#666" />
          <Text style={styles.statsText}> 댓글 {comments.length}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {post.communityType === '트로피' && (
        <TouchableOpacity
          style={styles.trophyBtn}
          onPress={() => console.log('트로피 버튼')}
        >
          <Ionicons name="trophy-outline" size={32} color="#FFC107" />
        </TouchableOpacity>
      )}
    </View>
  );

  // ---- 댓글 렌더 ----
  const renderCommentItem = ({ item }) => {
    if (!commentIconRefs.current[item.commentId]) commentIconRefs.current[item.commentId] = React.createRef();
    const anchorRef = commentIconRefs.current[item.commentId];
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <View style={styles.commentProfileAndName}>
            <Ionicons name="person-circle" size={36} color="#333" />
            <Text style={styles.commentAuthor}>{item.authorNickname}</Text>
          </View>
          <View style={styles.commentIconRow}>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => toggleCommentLike(item.commentId)}>
              <Feather name="thumbs-up" size={16} color={item.liked ? '#FBA834' : '#666'} />
              <Text style={styles.iconText}>{item.likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => openInput({ type: 'comment', id: item.commentId })}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity ref={anchorRef} onPress={() => setCommentMenuVisible(item.commentId)}>
              <Ionicons name="ellipsis-vertical" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentDateTime}>{item.createdAt?.slice(0,10)}</Text>
        {commentMenuVisible === item.commentId && (
          <Popover
            isVisible
            from={anchorRef}
            onRequestClose={() => setCommentMenuVisible(null)}
            placement="bottom"
          >
            <View style={styles.popoverContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentEdit(item.commentId)}>
                <Ionicons name="pencil" size={16} color="#333" />
                <Text style={styles.menuText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentDelete(item.commentId)}>
                <Ionicons name="trash" size={16} color="#333" />
                <Text style={styles.menuText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Popover>
        )}
        {/* 대댓글 */}
        {(item.replies || []).map((reply) => (
          <View style={styles.replyContainer} key={reply.commentId}>
            <View style={styles.replyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-undo-outline" size={16} color="#666" />
                <Ionicons name="person-circle" size={32} color="#333" style={styles.replyProfile} />
                <Text style={styles.replyAuthor}>{reply.authorNickname}</Text>
              </View>
              <View style={styles.commentIconRow}>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => toggleReplyLike(item.commentId, reply.commentId)}
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
            <Text style={styles.commentDateTime}>{reply.createdAt?.slice(0,10)}</Text>
            {/* 대댓글 삭제 */}
            {commentMenuVisible === reply.commentId && (
              <Popover
                isVisible
                from={anchorRef}
                onRequestClose={() => setCommentMenuVisible(null)}
                placement="bottom"
              >
                <View style={styles.popoverContainer}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => handleCommentDelete(reply.commentId)}>
                    <Ionicons name="trash" size={16} color="#333" />
                    <Text style={styles.menuText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </Popover>
            )}
          </View>
        ))}
      </View>
    );
  };

  // ---- 반환 ----
  return (
    <View style={styles.container}>
      <Header showBackButton leftContent={post?.diversity || '커뮤니티'} />

      <FlatList
        data={comments}
        keyExtractor={item => String(item.commentId)}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
      {/* 입력창 */}
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
      {/* 게시글 메뉴 Popover */}
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

// ---- 스타일 ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  listContent: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 20, paddingVertical: 10 },
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
  detailBox: { backgroundColor: '#F1F7FF' },
  labelText: { fontSize: 12, color: '#000' },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, paddingHorizontal: 20 },
  contentContainer: { marginBottom: 16, paddingHorizontal: 20 },
  contentText: { fontSize: 14, color: '#333', lineHeight: 20 },
  separator: { height: 1, backgroundColor: '#eaeaea' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingLeft: 6 },
  statsItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  statsText: { fontSize: 12, color: '#666', marginLeft: 4 },
  commentContainer: {
    backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 16,
    borderWidth: 0.5, borderColor: '#eaeaea',
    marginHorizontal: 14,
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentProfileAndName: { flexDirection: 'row', alignItems: 'center' },
  commentAuthor: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#333' },
  commentIconRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 12, color: '#666', marginLeft: 4 },
  commentText: { fontSize: 14, color: '#333', marginVertical: 6 },
  commentDateTime: { fontSize: 12, color: '#999', marginTop: 4 },
  replyContainer: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, marginTop: 8 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  replyProfile: { marginHorizontal: 4 },
  replyAuthor: { fontSize: 13, fontWeight: '600', color: '#333' },
  inputBarWrapper: {
    position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 6, backgroundColor: '#FFFFFF',
    borderRadius: 24, borderWidth: 2, borderColor: '#0A185B', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 3,
  },
  inputField: { flex: 1, fontSize: 14, color: '#000', marginRight: 8 },
  popoverContainer: {
    backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  menuText: { fontSize: 14, color: '#333', marginLeft: 6 },
  trophyBtn: {
    position: 'absolute', right: 20, bottom: 46, width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2,
  },
  trophyIcon: { width: 32, height: 32, resizeMode: 'contain' },
});
