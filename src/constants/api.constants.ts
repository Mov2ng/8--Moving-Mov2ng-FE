export const BASE_URL = "http://localhost:3000";
export const PRODUCT_URL = "http://moving.com";

// API 기본 URL (환경 변수 또는 기본값)
// TODO: 추후 .env에 있는 NEXT_PUBLIC_API과 BASE_URL, DEVELOPMENT_API_URL, PRODUCTION_API_URL 등 환경 변수를 분기하도록 설정
export const API_URL = process.env.NEXT_PUBLIC_API || BASE_URL;
