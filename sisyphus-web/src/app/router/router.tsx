import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PATHS } from './paths.constants';
import { ProtectedRoute } from './ProtectedRoute.component';

const Layout = lazy(() => import('@/features/layout/Main.layout'));
const AuthLayout = lazy(() => import('@/features/auth/Auth.layout'));
const Signin = lazy(() => import('@/features/auth/signin/Signin.page'));
const Signup = lazy(() => import('@/features/auth/signup/Signup.page'));
const OauthSuccessPage = lazy(
  () => import('@/features/auth/pages/OauthSuccess.page'),
);
const LinkHandlerPage = lazy(
  () => import('@/features/auth/pages/LinkHandler.page'),
);
const NotFoundPage = lazy(() => import('@/features/not-found/NoteFound.page'));
const HomePage = lazy(() => import('@/features/home/Home.page'));

// loader: protectedLoader, 타입 오류 이슈로 변경
const UserPage = lazy(() =>
  import('@/features/user/User.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const AddPage = lazy(() =>
  import('@/features/add/Add.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const ViewPage = lazy(() =>
  import('@/features/view/View.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const TagPage = lazy(() =>
  import('@/features/tag/Tag.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const CategoryPage = lazy(() =>
  import('@/features/category/Category.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const QuickEditPage = lazy(() =>
  import('@/features/quick_edit/QuickEdit.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const RequirePage = lazy(() =>
  import('@/features/require/Require.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const RequireDetailPage = lazy(() =>
  import('@/features/require/RequireDetail.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/Dashboard.page').then((mod) => ({
    default: mod.default as React.FC,
  })),
);

// jsx문법을 사용하지만 router는 일반 변수이기 때문에 소문자가 맞음.
export const router = createBrowserRouter([
  {
    path: PATHS.AUTH,
    element: <AuthLayout />,
    children: [
      {
        path: PATHS.SIGN_IN,
        element: <Signin />,
      },
      {
        path: PATHS.SIGN_UP,
        element: <Signup />,
      },
    ],
  },
  {
    path: PATHS.OAUTH,
    element: <OauthSuccessPage />,
  },
  {
    path: PATHS.LINK,
    element: <LinkHandlerPage />,
  },
  {
    path: PATHS.HOME,
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: PATHS.ADD,
        element: (
          <ProtectedRoute>
            <AddPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.QUICKEDIT,
        element: (
          <ProtectedRoute>
            <QuickEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.CATEGORY,
        element: (
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.TAG,
        element: (
          <ProtectedRoute>
            <TagPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.USER,
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.REQUIRE,
        element: (
          <ProtectedRoute>
            <RequirePage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.REQUIRE + '/:id',
        element: (
          <ProtectedRoute>
            <RequireDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.DASHBOARD,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: PATHS.VIEW,
        element: (
          <ProtectedRoute>
            <ViewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
