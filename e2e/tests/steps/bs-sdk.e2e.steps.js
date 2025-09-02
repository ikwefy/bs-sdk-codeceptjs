const { testPage } = inject();

Given('Navigate to codeceptjs', async () => {
  await testPage.navigate();
});

Given('Navigate to codeceptjs with wait time 50 sec', async () => {
  await testPage.navigateWithWait();
});
