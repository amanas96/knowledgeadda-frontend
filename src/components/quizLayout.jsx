// components/QuizLayout.jsx
import { Outlet } from "react-router-dom";

const QuizLayout = () => (
  <div className="h-screen overflow-hidden">
    <Outlet />
  </div>
);

export default QuizLayout;
