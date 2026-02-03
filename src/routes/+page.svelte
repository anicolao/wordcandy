<script lang="ts">
    import { onMount } from 'svelte';
    import { user, initFirebase, signInWithGoogle, signOut } from '$lib/firebase';
    import { base } from '$app/paths';

    onMount(() => {
        initFirebase();
    });
</script>

<div class="glass-panel" style="max-width: 400px; margin: 100px auto; text-align: center;">
    <h1 class="neon-text" style="color: var(--color-banana-yellow); font-size: 2rem;">WordCandy</h1>
    <p>Daily Challenge #1</p>
    
    <div style="margin: 2rem 0;">
        {#if $user}
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center;">
                <p>Welcome, {$user.displayName}!</p>
                <a href="{base}/play" class="btn-primary" style="
                    background: var(--color-banana-yellow);
                    color: black;
                    padding: 10px 30px;
                    border-radius: 20px;
                    font-weight: bold;
                    text-decoration: none;
                ">PLAY</a>
                
                <button on:click={signOut} style="
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                ">Sign Out</button>
            </div>
        {:else}
            <button on:click={signInWithGoogle} class="btn-primary" style="
                background: var(--color-nano-cyan);
                color: black;
                padding: 10px 30px;
                border-radius: 20px;
                font-weight: bold;
                border: none;
                cursor: pointer;
            ">Sign in with Google</button>
        {/if}
    </div>

    {#if !$user}
        <p style="opacity: 0.7; font-size: 0.8rem;">Sign in to compete on the leaderboard</p>
    {/if}
</div>
