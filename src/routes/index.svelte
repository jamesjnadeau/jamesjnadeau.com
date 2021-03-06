<script>
  import PageTransition from "../components/PageTransition"

  // redirect to netlify cms
  import { onMount } from "svelte";
  const netlifyIdentity = require("netlify-identity-widget");

  onMount(() => {
    if (netlifyIdentity) {
      netlifyIdentity.init();
      netlifyIdentity.on("init", user => {
        if (!user) {
          netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
  });

  var description = 'James Nadeau is a Senior Systems Engineer, helping customers realize their information systems for over 10 years. If you need it on time, scalable, and secure, I can come through for you. Let\'s work together and create something awesome!';
  var keywords = 'James Nadeau, James J Nadeau, Senior Systems Engineer, Computer Engineer, Vermont, Programmer, Developer, Software Engineer, Software Developer, Full Stack Developer';

  let more_about_me_isOpen = false;
  let more_about_this_site_isOpen = false;
</script>
<style>
.card-header {
  cursor: pointer;
}
</style>

<svelte:head>
  <title>James J Nadeau | Senior Systems Engineer</title>
</svelte:head>

<PageTransition>
  <div id="container" class="container">
    <div class="content">
      <h1>Senior Systems Engineer</h1>
      <div>
        <img
          class="img-fluid img-rounded"
          style="margin-bottom: 5px;"
          src="/files/tree_line.jpg"
          alt="Clouds above a the tops of trees in a forest." />
      </div>
      <div class="content d-flex flex-column">
        <div class="card card-default my-3">
          <div class="card-body p-note">
            <p>
              Hi,
              <br />
              <br />
              Thanks for coming! My name is James, and I live in&nbsp;
              <a href="https://maps.google.com/maps?q=Weybridge,+VT">Vermont.</a>
              &nbsp;A long time ago, I attended&nbsp;
              <a href="http://www.rpi.edu/" rel="nofollow">RPI</a>
              &nbsp;to study Computer Science and Systems Engineering. I've been
              up to a&nbsp;
              <a href="/projects/">lot</a>
              &nbsp;since then. Through the use of systems I've created, I've
              helped thousands of businesses, big and small, grow and create happy
              customers. How can I help you?
            </p>
            <p>
              I am an open source loving, full stack developer and system
              designer. I've designed, architected, and built applications for
              both desktop and mobile. Ranging from video trancoding for the
              automobile footage industry, business and content management systems
              for the non-profit to the fashion industry, and even website systems
              for plumbers. My varied experince is an asset that brings helpful
              insights to tough situations. I can help you tackle your technical
              problems, because I probably have before.
            </p>
            <p>
              I excel at cleaning up other peoples messes, and hitting deadlines.
              Third party security tests have been unable to get past the security
              practices I use, time and time again. If you need it on time,
              scalable, and secure, I can come through for you.
            </p>
          </div>
        </div>
        <div class="card card-default my-3">
          <div class="card-header" on:click={() => more_about_me_isOpen = !more_about_me_isOpen }>
            <h4
              class="card-title text-center m-0"
              data-toggle="collapse"
              href="#more_about_me">
              More About Me
            </h4>
          </div>
          {#if more_about_me_isOpen}
            <div class="card-collapse" id="more_about_me">
              <div class="card-body">
                <p>
                  I love Vermont, and am proud to call this state my home. I enjoy
                  football, not for the names, but for the strategy and teamwork
                  required to win. I am currently a high school football referee in
                  Vermont. The pay isn't great, but it's a great excuse to drive
                  around VT in the fall and watch some football.
                </p>
                <p>
                  Sailing is also one of my hobbies.
                  <del>
                    I own a small sunfish sailboat, but am hoping to upgrade soon to
                    something with a cabin.
                  </del>
                  I now own a Pearsons 23K, and I've been loving it! Lake champlain
                  is a hop, skip and a jump away, and all that it has to explore has
                  never let me down.
                </p>
                <p>
                  The product of a ski bum mother, I enjoy hitting the slopes in the
                  winter when the weather allows. Admittedly, I'm a little spoiled
                  from my upbringing and haven't gone much in the past couple of
                  years.
                </p>
                <p>
                  I've owned a computer since the ripe age of 4. A Macintosh SE as a
                  matter of fact. My mother was/is a graphic artist, and it was
                  bought for her. I think we can both agree I got more out of it. I
                  didn't really discover linux until I was about 15 and began
                  throwing it on every old piece of hardware I could muster.
                </p>
                <p>
                  I met the love of my life online and married Sally in June 2015.
                  Our dog Walter helps me do my job every day. My first son Tyson
                  just turned two in October!
                </p>
              </div>
            </div>
          {/if}
        </div>
        <div class="card card-default my-3">
          <div class="card-header" on:click={() => more_about_this_site_isOpen = !more_about_this_site_isOpen }>
            <h4
              class="card-title text-center m-0"
              data-toggle="collapse"
              href="#more_about_this_site">
              More About This Site
            </h4>
          </div>
          {#if more_about_this_site_isOpen}
            <div class="card-collapse" id="more_about_this_site">
              <div class="card-body">
                <p>This site was recently(Dec 2019) converted to a Sapper/Svelte based static site hosted on netlify.</p> 
                <p>
                  This site was last built using webpack along with a custom loader I
                  created called&nbsp;
                  <a href="https://www.npmjs.com/package/static-site-loader">
                    static-site-loader
                  </a>
                  . I'm able to write both markdown and regular jade template files
                  and have them be loaded/refreshed by webpack upon change.
                </p>
                <p>
                  You can view the code for this site
                  <a href="https://github.com/jamesjnadeau/jamesjnadeau.com">
                    here
                  </a>
                  .
                </p>
              </div>
            </div>
          {/if}
        </div>
      </div>

    </div>
  </div>
</PageTransition>
