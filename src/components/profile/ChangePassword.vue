<!-- <form class="flex flex-col gap-y-4 my-2 2xl:text-xl">
      <FormInput
        v-model="password"
        :placeholder="$t('newPassword')"
        type="password"
      />
      <FormInput
        v-model="confirmPassword"
        :placeholder="$t('confirmPassword')"
        type="password"
      />

      <Button class="mt-2" type="submit">{{
        $t("change").toLocaleUpperCase()
      }}</Button>
    </form> -->
<!-- 
  <form
    v-else
    @submit.prevent="confirmUser"
    class="flex flex-col gap-y-3 2xl:text-xl"
  >
    <h4 class="mb-1 text-base">{{ $t("confirmPasswordToChangeData") }}</h4>
    <FormInput
      v-model="userPassword"
      type="password"
      placeholder="**********"
    />

    <FormError v-if="error" :error="$t(error)" @clear-error="error = null" />

    <Button :loading="loading" type="submit">{{
      loading
        ? $t("confirming").toLocaleUpperCase()
        : $t("confirm").toLocaleUpperCase()
    }}</Button>
  </form> -->
