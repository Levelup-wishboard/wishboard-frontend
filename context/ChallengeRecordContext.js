//ChallengeRecordContext.js
import React, { createContext, useState } from 'react';

export const ChallengeRecordContext = createContext();

export const ChallengeRecordProvider = ({ children }) => {
  const initialRecordMap = {
    1: [  
      {
        date: '2025.06.01',
        image: null,
        text: '운동화사기',
      },
      {
        date: '2025.06.03',
        image: null,
        text: '동네 걷기',
      },
    ],
    2: [  
      {
        date: '2025.05.30',
        image: null,
        text: '비행기표 알아보기기',
      },
      {
        date: '2025.06.02',
        image: null,
        text: '여행일정 짜기기',
      },
    ],
    3: [  
      {
        date: '2025.05.25',
        image: null,
        text: '기타사기기',
      },
      {
        date: '2025.05.31',
        image: null,
        text: '유튜브 강의 찾아보기기',
      },
    ],
  };

  const [recordMap, setRecordMap] = useState(initialRecordMap);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  };

  const addRecord = (bucketId, record) => {
    setRecordMap((prevMap) => {
      const existing = prevMap[bucketId] || [];
      return {
        ...prevMap,
        [bucketId]: [record, ...existing],
      };
    });
  };

  const updateRecord = (bucketId, updatedRecord) => {
    setRecordMap((prevMap) => {
      const list = prevMap[bucketId] || [];
      const newList = list.map((rec) =>
        rec.date === updatedRecord.date ? updatedRecord : rec
      );
      return { ...prevMap, [bucketId]: newList };
    });
  };

  const getRecordByDate = (bucketId, date) => {
    return recordMap[bucketId]?.find((rec) => rec.date === date);
  };

  const getRecords = (bucketId) => {
    return recordMap[bucketId] || [];
  };

  return (
    <ChallengeRecordContext.Provider
      value={{
        recordMap,
        addRecord,
        updateRecord,
        getRecordByDate,
        getRecords,
        getTodayDate,
      }}
    >
      {children}
    </ChallengeRecordContext.Provider>
  );
};
