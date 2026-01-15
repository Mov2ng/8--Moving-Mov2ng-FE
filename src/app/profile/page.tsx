import ProfileContainer from "./(components)/ProfileContainer";

/**
 * 마이페이지 - 기사님 전용
 * RouteGuard에서 기사님만 접근 가능하도록 처리됨
 */
export default function ProfilePage() {
  return (
    <>
      <ProfileContainer />
    </>
  );
}
