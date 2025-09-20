export async function signOutClient(barbershopId?: string): Promise<void> {
  try {
    // Fazer logout via API do NextAuth com CSRF token
    const csrfResponse = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfResponse.json();

    await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        csrfToken: csrfToken || "",
        json: "true",
      }),
    });

    // Limpar storage local se necessário
    localStorage.clear();
    sessionStorage.clear();

    // Aguardar um pouco para garantir que o logout foi processado
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Redirecionar manualmente
    const redirectUrl = `/barber_app/client/login?id=${barbershopId}`;
    window.location.replace(redirectUrl); // usar replace em vez de href
  } catch (error) {
    console.error("Erro no logout:", error);
    // Mesmo com erro, redirecionar
    window.location.replace(`/barber_app/client/login?id=${barbershopId}`);
  }
}
