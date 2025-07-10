import { AuthFormField } from './auth/Auth.form';
import { useAuthStore } from './auth/auth.store';
import { SocialLoginButtons } from './auth/SocialLoginButtons.component';
import { useMessageStore } from './message.store';
import { NoteFormField } from './note/Note.form';

export default function ContentPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const msg = useMessageStore((state) => state.msg);

  return (
    <main id="main">
      {msg && <span className="state_msg">{msg}</span>}
      {!accessToken ? (
        <>
          <AuthFormField />
          <hr />
          <SocialLoginButtons />
        </>
      ) : (
        <NoteFormField />
      )}
    </main>
  );
}
