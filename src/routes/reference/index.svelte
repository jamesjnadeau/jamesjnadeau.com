<script>
  import { pageIn, pageOut } from "../_page_transition";
  import { fly } from 'svelte/transition';
</script>

<svelte:head>
  <title>Today I ...</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}>
  <div class="card">
    <!-- Nav tabs-->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" href="#quotes" role="tab" data-toggle="tab">
          quotes
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#js" role="tab" data-toggle="tab">JS</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#git" role="tab" data-toggle="tab">Git</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#shell" role="tab" data-toggle="tab">Shell</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#php" role="tab" data-toggle="tab">PHP</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#misc" role="tab" data-toggle="tab">Misc</a>
      </li>
      <i class="nav-item">
        <a class="nav-link" href="/presentations">Slides</a>
      </i>
    </ul>
    <!-- Tab panes-->
    <div class="tab-content bg-light py-3">
      <div class="tab-pane fade in" id="js">
        <ul class="list-group m-3">
          <a class="list-group-item" href="/reference/js_backtrace">
            Backtrace
          </a>
          <a class="list-group-item" href="/reference/js_callback">Callback</a>
          <a class="list-group-item" href="/reference/js_debounce">Debounce</a>
          <a class="list-group-item" href="/reference/js_Angular">Angular</a>
          <a class="list-group-item" href="/reference/jqm_google_analytics">
            jQuery Mobile Google Analytics
          </a>
        </ul>
      </div>
      <div class="tab-pane fade" id="git">
        <ul class="list-group m-3">
          <a class="list-group-item" href="/reference/git_flow">Flow</a>
          <a class="list-group-item" href="/reference/git_autocomplete">
            Autocomplete
          </a>
          <a class="list-group-item" href="/reference/git_local_ignore">
            Local .gitignore
          </a>
          <a class="list-group-item" href="/reference/git_theirs">
            Rebase Theirs
          </a>
        </ul>
      </div>
      <div class="tab-pane fade" id="shell">
        <ul class="list-group m-3">
          <a class="list-group-item" href="/reference/ssh_tunnel">
            SSH Tunneling
          </a>
          <a class="list-group-item" href="/reference/bash_profile">
            Bash Profile
          </a>
          <a class="list-group-item" href="/reference/counting_log_ips">
            Counting IP Addresses in Log Files
          </a>
          <a class="list-group-item" href="/reference/yum_history">
            Yum History/Undo
          </a>
          <a class="list-group-item" href="/reference/svn_add">SVN Add</a>
        </ul>
      </div>
      <div class="tab-pane fade" id="php">
        <ul class="list-group m-3">
          <li class="list-group-item">
            <a href="/reference/php_backtrace">Backtrace</a>
          </li>
          <li class="list-group-item">
            <a href="/reference/php_cake_query_log">CakePHP 1.2 query log</a>
          </li>
        </ul>
      </div>
      <div class="tab-pane fade" id="misc">
        <ul class="list-group m-3">
          <a class="list-group-item" href="/reference/letsencrypt">
            Lets Encrypt
          </a>
          <a class="list-group-item" href="/reference/stock_photos">
            Stock Photos
          </a>
          <a
            class="list-group-item"
            href="http://www.w3.org/TR/html5/forms.html#valid-e-mail-address">
            Email Addresses
          </a>
          <a class="list-group-item" href="/reference/chromebook">
            Chromebook Crouton
          </a>
          <a class="list-group-item" href="/reference/asus_laptop">
            Asus Laptop
          </a>
          <a class="list-group-item" href="/reference/gnome3_monitor_config">
            Gnome 3 Master Monitor
          </a>
          <a class="list-group-item" href="/reference/evoulent_mouse_config">
            Evoluent Mouse config for Linux
          </a>
          <a class="list-group-item" href="/reference/gource">
            Gource defaults
          </a>
          <a class="list-group-item" href="/reference/convert-video-to-png">
            Convert Video to png
          </a>
        </ul>
      </div>
      <div class="tab-pane active show fade in" id="quotes">
        <div class="row justify-content-center">
          <div class="card col-md-5 m-1 p-3">
            <h4>Story Starter</h4>
            When _____ , I want to _____ , so I can _____ .
          </div>
          <div class="card col-md-5 m-1 p-3">
            <a href="https://youtu.be/_yCz1TA0EL4">
              You should use [insert library/framework], it's the bestestest!
            </a>
          </div>
          <div class="card col-md-5 m-1 p-3">
            "A society grows great when old men plant trees whose shade they
            know they shall never sit in" ― Greek Proverb
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Grief can take care if itself, but to get the full value of a joy
            you must have somebody to divide it with.” ― Mark Twain
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Holding on to anger is like grasping a hot coal with the intent of
            throwing it at someone else; you are the one who gets burned.” ―
            Buddha
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Anything that works will be used in progressively more challenging
            applications, until it fails." ― Laurence J. Peter, The Generalized
            Peter Principle.
          </div>
          <div class="card col-md-5 m-1 p-3">
            "The major difference between a thing that might go wrong and a
            thing that cannot possibly go wrong is that when a thing that cannot
            possibly go wrong goes wrong it usually turns out to be impossible
            to get at or repair." ― Douglas Adams
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Any organization that designs a system (defined broadly) will
            produce a design whose structure is a copy of the organization's
            communication structure." ― Conway's Law
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Knowledge comes, but wisdom lingers. It may not be difficult to
            store up in the mind a vast quantity of facts within a comparatively
            short time, but the ability to form judgments requires the severe
            discipline of hard work and the tempering heat of experience and
            maturity.” ― Calvin Coolidge
          </div>
          <div class="card col-md-5 m-1 p-3">
            "The men who attempt to survive, not by means of reason, but by
            means of force, are attempting to survive by the method of animals."
            ― Ayn Rand
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Making bits harder to copy is like making water less wet." ― Bruce
            Schneier
          </div>
          <div class="card col-md-5 m-1 p-3">
            "No one wants to die. Even people who want to go to heaven don't
            want to die to get there. And yet death is the destination we all
            share. No one has ever escaped it. And that is as it should be,
            because Death is very likely the single best invention of Life. It
            is Life's change agent. It clears out the old to make way for the
            new." ― Steve Jobs
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Do not despair of our present difficulties but believe always in
            the promise and greatness of America, because nothing is inevitable
            here. Americans never quit. We never surrender. We never hide from
            history. We make history." ― John McCain
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Truth is, I'll never know all there is to know about you just as
            you will never know all there is to know about me. Humans are by
            nature too complicated to be understood fully. So, we can choose
            either to approach our fellow human beings with suspicion or to
            approach them with an open mind, a dash of optimism and a great deal
            of candour.” ― Tom Hanks
          </div>
          <div class="card col-md-5 m-1 p-3">
            “It is easier to fool the people then convince them they have been
            fooled.” - Samuel Clements
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Life shrinks or expands in proportion to one's courage.” ― Anais
            Nin
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Progress is impossible without change, and those who cannot change
            their minds cannot change anything.” ― George Bernard Shaw
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Patriotism is supporting your country all the time, and your
            government when it deserves it.” ― Mark Twain
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Humility is not thinking less of yourself, it's thinking of
            yourself less.” ― Rick Warren
          </div>
          <div class="card col-md-5 m-1 p-3">
            “I’ve always been very careful never to predict anything that has
            not already happened.” — Marshall McLuhan
          </div>
          <div class="card col-md-5 m-1 p-3">
            “The cure for boredom is curiosity. There is no cure for curiosity.”
            — Dorothy Parker
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Decisions are made by those who show up.” — Jennifer Pahlka
          </div>
          <div class="card col-md-5 m-1 p-3">
            “If at first the idea is not absurd, then there is no hope for it.”
            — Albert Einstein
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Not long ago what we have today was so implausible that nobody
            bothered to say it would never happen.“ — Marc Andreessen
          </div>
          <div class="card col-md-5 m-1 p-3">
            "The first 90% of a project is a lot easier than the second 90%.” —
            Tim Sweeney
          </div>
          <div class="card col-md-5 m-1 p-3">
            “If you don’t like change, you are going to like irrelevance even
            less.” — General Shinseki
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Let us realize the arc of the moral universe is long, but it bends
            toward justice" — Martin Luther King
          </div>
          <div class="card col-md-5 m-1 p-3">
            "You aren’t wealthy until you have something that money can’t buy."
            — Garth Brooks
          </div>
          <div class="card col-md-5 m-1 p-3">
            "I think I speak for everyone when I say no one can speak for all of
            us." —Glenn Fleishman
          </div>
          <div class="card col-md-5 m-1 p-3">
            "The question isn’t who is going to let me: it’s who is going to
            stop me." — Ayn Rand
          </div>
          <div class="card col-md-5 m-1 p-3">
            "No limit for better." — Harrison Ford
          </div>
          <div class="card col-md-5 m-1 p-3">
            “I have never in my life envied a human being who led an easy life;
            I have envied a great many people who led difficult lives and led
            them well.” ― Theodore Roosevelt
          </div>
          <div class="card col-md-5 m-1 p-3">
            “What do we live for, if it is not to make life less difficult for
            each other?” — George Eliot
          </div>
          <div class="card col-md-5 m-1 p-3">
            “At some point in life the world’s beauty becomes enough. You don’t
            need to photograph, paint or even remember it. It is enough.” — Toni
            Morrison
          </div>
          <div class="card col-md-5 m-1 p-3">
            “The cradle rocks above an abyss, and common sense tells us that our
            existence is but a brief crack of light between two eternities of
            darkness.” — Vladimir Nabokov
          </div>
          <div class="card col-md-5 m-1 p-3">
            "When an honest man learns he is mistaken, he will either cease to
            be mistaken, or he will cease to be an honest man." unknown
          </div>
          <div class="card col-md-5 m-1 p-3">
            "Technology can be invented; human nature is something we're stuck
            with."&nbsp;
            <a
              href="http://worrydream.com/#!/ABriefRantOnTheFutureOfInteractionDesign"
              rel="noopener">
              Bret Victor
            </a>
          </div>
          <div class="card col-md-5 m-1 p-3">
            “Do not hold your views too firmly. Every fool is fully convinced,
            and every one fully persuaded is a fool: the more erroneous his
            judgment the more firmly he holds it.” — Jesuit Baltasar Gracián
          </div>
          <div class="card col-md-5 m-1 p-3">
            "It is our failure to become our perceived ideal that ultimately
            defines us and makes us unique." &emsp; Conan O’Brien
          </div>
          <div class="card col-md-5 m1 p-3">
            "When a measure becomes a target, it ceases to be a good measure"
            &emsp; Goodhart's Law (Popular formulation)
          </div>
          <div class="card col-md-5 m1 p-3">
            “The most courageous decision that you can make each day is to be in
            a good mood.” — Voltaire
          </div>
          <div class="card col-md-5 m1 p-3">
            “Let everything happen to you: beauty and terror. Just keep going.
            No feeling is final.” — Rainer Maria Rilke
          </div>
          <div class="card col-md-5 m1 p-3">
            “A good marriage is one in which each spouse secretly thinks he or
            she got the better deal, and this is true also of our friendships.”
            — Anne Lamott
          </div>
          <div class="card col-md-5 m-1 p-3">
            <h4>Smile</h4>
            <p>ᕕ( ᐛ )ᕗ</p>
            <span>╰(´ڡ`)╯</span>
            <p>ᕕ( ˊᵕˋ )୨</p>
            <span>ʘ ͜ʖ ʘ</span>
            <p>( ＾◡＾ )</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
