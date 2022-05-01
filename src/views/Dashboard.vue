<script setup lang="ts">
import { userModule } from '../store/user'

import Follows from '../components/Follows.vue'

</script>

<template>
    <div class="content">
        <p v-if="!userModule.isLogged">Enter the ID of a VOD in the search bar above and enjoy ;)</p>
        <Follows v-else />
    </div>
</template>