//BucketListContext.js
import React, { createContext, useState } from 'react';

export const BucketListContext = createContext();

export const BucketListProvider = ({ children }) => {
  const [bucketList, setBucketList] = useState([
    {
      id: 1,
      dday: 'D-30',
      tag: '해보고싶다',
      image: require('../assets/images/profile1.png'),
      text: '마라톤 완주하기',
      reason: '몸 관리를 위해 목표를 정하고 싶어서',
      vow: '주 3회, 5km 이상씩 3개월간 달리기 연습',
      pinned: true,
    },
    {
      id: 2,
      dday: '언젠가',
      tag: '해보고싶다',
      image: require('../assets/images/profile2.png'),
      text: '제주도 여행',
      reason: '얼마 남지 않은 시간 안에 꼭 가보고 싶어서',
      vow: '2025년 12월 안에 제주도 3박 4일 여행 계획 세우기',
      pinned: true,
    },
    {
      id: 3,
      dday: 'D-100',
      tag: '배우고싶다',
      image: require('../assets/images/profile3.png'),
      text: '기타배우기',
      reason: '어릴 때부터 연주해보고 싶었지만 배우지 못해서',
      vow: '매주 2회, 1시간씩 온라인 강의 듣고 연습하기',
      pinned: true,
    },
  ]);

  const addBucketItem = (item) => {
    setBucketList(prev => [...prev, { ...item, id: Date.now().toString(), pinned: false }]);
  };

  const updateBucketItem = (id, updatedItem) => {
    setBucketList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const deleteBucketItem = (id) => {
    setBucketList(prev => prev.filter(item => item.id !== id));
  };

  const togglePin = (id) => {
    setBucketList((prevList) => {
      const target = prevList.find((item) => item.id === id);
      const currentlyPinned = prevList.filter((item) => item.pinned);

      // 이미 고정된 항목을 해제할 경우
      if (target.pinned) {
        return prevList.map((item) =>
          item.id === id ? { ...item, pinned: false } : item
        );
      }

      // 아직 고정된 항목이 3개 미만일 경우만 새로 고정
      if (currentlyPinned.length < 3) {
        return prevList.map((item) =>
          item.id === id ? { ...item, pinned: true } : item
        );
      }

      // 이미 3개 고정되어 있으면 변경하지 않음
      return prevList;
    });
  };
  const markBucketAsCompleted = (id) => {
  setBucketList(prev =>
    prev.map(item =>
      item.id === id ? { ...item, completed: true } : item
    )
  );
};

  return (
    <BucketListContext.Provider
      value={{ bucketList, addBucketItem, updateBucketItem, deleteBucketItem, togglePin,  markBucketAsCompleted }}
    >
      {children}
    </BucketListContext.Provider>
  );
};


