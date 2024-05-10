const { testPage } = inject();

Given('Navigate to codeceptjs', async () => {
  await testPage.navigate();
});
