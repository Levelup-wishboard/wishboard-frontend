// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { BucketListProvider } from './context/BucketListContext';
import { TrophyProvider } from './context/TrophyContext';
import { ChallengeRecordProvider } from './context/ChallengeRecordContext'; // ✅ 추가

export default function App() {
  return (
    <ChallengeRecordProvider>      {/* ✅ 이 부분 추가 */}
      <BucketListProvider>
        <TrophyProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TrophyProvider>
      </BucketListProvider>
    </ChallengeRecordProvider>
  );
}

