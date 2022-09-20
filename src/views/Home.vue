<template>
  <div class="container-fluid">
    <template v-if="contests">
      <div class="card card-body" v-if="contests.data.total > 0">
        <div
          id="carouselExampleIndicators"
          class="carousel carousel-dark slide"
          data-bs-ride="carousel"
          ref="contest_carousel"
          style="max-height: 200px"
        >
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="position-relative">
                <img
                  src="@/assets/contest_background.png"
                  class="img-fluid mx-auto d-block"
                  style="max-height: 200px"
                  role="button"
                  @click="
                    $router.push({
                      name: 'Contest',
                      params: { id: contests.data.results[0].id },
                    })
                  "
                />
                <div
                  class="position-absolute bottom-0 start-50 translate-middle-x"
                >
                  <div class="d-flex justify-content-between">
                    <h5>{{ contests.data.results[0].title }}</h5>
                    <h5 class="d-none d-sm-block">
                      <i class="bi bi-clock-history"></i>
                      {{ get_remain(contests.data.results[0].start_time) }}
                    </h5>
                  </div>
                  <div class="d-none d-sm-block">
                    <span class="badge rounded-pill bg-info"
                      ><i class="bi bi-calendar-check px-1"></i
                      >{{
                        new Date(
                          contests.data.results[0].start_time
                        ).toLocaleString()
                      }}</span
                    >
                    &nbsp;
                    <span class="badge rounded-pill bg-warning"
                      ><i class="bi bi-trophy-fill px-1"></i
                      >{{ contests.data.results[0].rule_type }}</span
                    >
                    &nbsp;
                    <span
                      v-html="
                        get_last(
                          contests.data.results[0].start_time,
                          contests.data.results[0].end_time
                        )
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="carousel-item position-relative"
              v-for="i in contests.data.results.length - 1"
              :key="i"
            >
              <img
                src="@/assets/contest_background.png"
                class="img-fluid mx-auto d-block"
                style="max-height: 200px"
                role="button"
                @click="
                  $router.push({
                    name: 'Contest',
                    params: { id: contests.data.results[i].id },
                  })
                "
              />
              <div
                class="position-absolute bottom-0 start-50 translate-middle-x"
              >
                <div class="d-flex justify-content-between">
                  <h5>{{ contests.data.results[i].title }}</h5>
                  <h5 class="d-none d-sm-block">
                    <i class="bi bi-clock-history"></i>
                    {{ get_remain(contests.data.results[i].start_time) }}
                  </h5>
                </div>
                <div class="d-none d-sm-block">
                  <span class="badge rounded-pill bg-info"
                    ><i class="bi bi-calendar-check px-1"></i
                    >{{
                      new Date(
                        contests.data.results[i].start_time
                      ).toLocaleString()
                    }}</span
                  >
                  &nbsp;
                  <span class="badge rounded-pill bg-warning"
                    ><i class="bi bi-trophy-fill px-1"></i
                    >{{ contests.data.results[i].rule_type }}</span
                  >
                  &nbsp;
                  <span
                    v-html="
                      get_last(
                        contests.data.results[i].start_time,
                        contests.data.results[i].end_time
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <br v-if="contests.data.total > 0" />
    </template>
    <Announcement />
  </div>
</template>
<script>
import Carousel from "bootstrap/js/dist/carousel.js";
import Announcement from "@/components/Announce.vue";
//import Chart from '@/components/Chart.vue'

export default {
  name: "Home",
  components: {
    Announcement,
    //Chart
  },
  data() {
    return {
      next_chart_type: "OI Rank",
      chart_btn: false,
      chart_option: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10,
          },
        },
      },
      chart_data: {
        datasets: [
          {
            data: [],
            label: "AC",
            backgroundColor: "#dc3545",
          },
          {
            data: [],
            label: "Total",
            backgroundColor: "#003480",
          },
        ],
        labels: [],
      },
      rank: null,
      carousel: null,
      contests: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http
        .get(window.location.origin + "/api/contests?offset=0&limit=5&status=1")
        .then((response) => {
          this.contests = response.data;
          if (this.contests.data.total > 0) {
            this.carousel = new Carousel(this.$refs.contest_carousel, {
              interval: 6000,
              wrap: true,
            });
          }
        });
    },
    change() {
      this.rank = null;
      this.chart_btn = true;
      if (this.next_chart_type == "OI Rank") {
        this.next_chart_type = "ACM Rank";
        this.oi_chart();
      } else {
        this.next_chart_type = "OI Rank";
        this.acm_chart();
      }
    },
    get_remain(start) {
      const total_ = Date.parse(new Date(start)) - Date.parse(new Date());
      const seconds_ = Math.floor((total_ / 1000) % 60);
      const minutes_ = Math.floor((total_ / 1000 / 60) % 60);
      const hours_ = Math.floor((total_ / (1000 * 60 * 60)) % 24);
      const days_ = Math.floor(total_ / (1000 * 60 * 60 * 24));
      return (
        (days_ == 0 ? "" : days_ + "d ") +
        (hours_ < 10 ? "0" + hours_ : hours_) +
        ":" +
        (minutes_ < 10 ? "0" + minutes_ : minutes_) +
        ":" +
        (seconds_ < 10 ? "0" + seconds_ : seconds_)
      );
    },
    get_last(start, end) {
      const total_ = Date.parse(new Date(end)) - Date.parse(new Date(start));
      const seconds_ = Math.floor((total_ / 1000) % 60);
      const minutes_ = Math.floor((total_ / 1000 / 60) % 60);
      const hours_ = Math.floor((total_ / (1000 * 60 * 60)) % 24);
      const days_ = Math.floor(total_ / (1000 * 60 * 60 * 24));
      return (
        '<span class="badge rounded-pill bg-success"><i class="bi bi-stopwatch-fill px-1"></i>' +
        (days_ == 0 ? "" : days_ + "d ") +
        (hours_ < 10 ? "0" + hours_ : hours_) +
        ":" +
        (minutes_ < 10 ? "0" + minutes_ : minutes_) +
        ":" +
        (seconds_ < 10 ? "0" + seconds_ : seconds_) +
        "</span>"
      );
    },
  },
};
</script>

<style scoped></style>
