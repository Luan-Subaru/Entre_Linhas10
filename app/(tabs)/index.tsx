import { Redirect } from 'expo-router';

export default function Index() {
  // Esse comando força o aplicativo a abrir direto na sua tela de login
  return <Redirect href="/login" />;
}