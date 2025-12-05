export default function SamplePage() {
  return (
    
    <div className="p-8 space-y-8">
      {/* Pretendard 폰트 utility 클래스 사용 예시 */}
      <section>
        <h1 className="pret-3xl-bold mb-4">폰트 테스트</h1>
        <h2 className="pret-2xl-semibold">중간 제목 (24px, Semibold)</h2>
        <p className="pret-lg-regular">본문 텍스트 (16px, Regular)</p>
        <span className="pret-14-medium">작은 텍스트 (14px, Medium)</span>
        <span className="pret-xs-regular">가장 작은 텍스트 (12px, Regular)</span>
      </section>

      {/* 색상 테스트 */}
      <section>
        <h1 className="pret-3xl-bold mb-6">색상 팔레트 테스트</h1>
        
        {/* Black 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Black</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-black-100 text-gray-50 p-4 rounded">black-100</div>
            <div className="bg-black-200 text-gray-50 p-4 rounded">black-200</div>
            <div className="bg-black-300 text-gray-50 p-4 rounded">black-300</div>
            <div className="bg-black-400 text-gray-50 p-4 rounded">black-400</div>
            <div className="bg-black-500 text-gray-50 p-4 rounded">black-500</div>
          </div>
        </div>

        {/* Gray 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Gray</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-gray-50 text-black-500 p-4 rounded border border-line-200">gray-50</div>
            <div className="bg-gray-100 text-black-500 p-4 rounded border border-line-200">gray-100</div>
            <div className="bg-gray-200 text-black-500 p-4 rounded border border-line-200">gray-200</div>
            <div className="bg-gray-300 text-black-500 p-4 rounded border border-line-200">gray-300</div>
            <div className="bg-gray-400 text-gray-50 p-4 rounded">gray-400</div>
            <div className="bg-gray-500 text-gray-50 p-4 rounded">gray-500</div>
          </div>
        </div>

        {/* Primary Blue 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Primary Blue</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-primary-blue-50 text-black-500 p-4 rounded border border-line-200">primary-blue-50</div>
            <div className="bg-primary-blue-100 text-black-500 p-4 rounded border border-line-200">primary-blue-100</div>
            <div className="bg-primary-blue-200 text-gray-50 p-4 rounded">primary-blue-200</div>
            <div className="bg-primary-blue-300 text-gray-50 p-4 rounded">primary-blue-300</div>
            <div className="bg-primary-blue-400 text-gray-50 p-4 rounded">primary-blue-400</div>
          </div>
        </div>

        {/* Secondary Yellow 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Secondary Yellow</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-secondary-yellow-100 text-black-500 p-4 rounded">secondary-yellow-100</div>
          </div>
        </div>

        {/* Secondary Red 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Secondary Red</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-secondary-red-100 text-black-500 p-4 rounded border border-line-200">secondary-red-100</div>
            <div className="bg-secondary-red-200 text-gray-50 p-4 rounded">secondary-red-200</div>
          </div>
        </div>

        {/* Background 색상 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Background</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-background-100 text-black-500 p-4 rounded border border-line-200">background-100</div>
            <div className="bg-background-200 text-black-500 p-4 rounded border border-line-200">background-200</div>
            <div className="bg-background-300 text-black-500 p-4 rounded border border-line-200">background-300</div>
            <div className="bg-background-400 text-black-500 p-4 rounded border border-line-200">background-400</div>
          </div>
        </div>

        {/* Line 색상 (Border 테스트) */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">Line (Border)</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-background-100 text-black-500 p-4 rounded border-2 border-line-100">border-line-100</div>
            <div className="bg-background-100 text-black-500 p-4 rounded border-2 border-line-200">border-line-200</div>
          </div>
        </div>

        {/* 실제 사용 예시 */}
        <div className="mb-6">
          <h2 className="pret-2xl-semibold mb-3">실제 사용 예시</h2>
          <div className="bg-primary-blue-300 text-gray-50 border-line-200 border-2 p-6 rounded-lg">
            <p className="pret-lg-semibold mb-2">bg-primary-blue-300</p>
            <p className="pret-lg-regular">text-gray-50</p>
            <p className="pret-lg-regular">border-line-200</p>
          </div>
        </div>
      </section>
    </div>
  );
}