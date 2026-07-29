# Recreates the 4-panel hypertension-prevalence figure for the Studio page.
# Point estimates only (no CIs), restyled to sit alongside the cohesion figures.
# Values are transcribed from the published figure (Am. J. Prev. Med., 2024).
# Output: design-port/alcohol-hypertension.png

library(ggplot2)
library(dplyr)
library(tidyr)
library(stringr)

out_png <- "/Users/mm992584/Library/CloudStorage/OneDrive-UniversityatAlbany-SUNY/Summer 2026/academic-website/design-port/alcohol-hypertension.png"

consumption_levels <- c(
  "0. Abstainer",
  "1. Former",
  "2. Less than Once a Month",
  "3. Once a Month to Once a Week",
  "4. >1 to 3 Times per Week",
  "5. >3 Times per Week",
  "6. Binge 1-12 Times last year",
  "7. Binge >12 Times last year",
  "9. Missing"
)
panel_levels <- c("A. Measured", "B. Diagnosed", "C. Undiagnosed", "D. Composite")

prev <- tibble::tribble(
  ~consumption,                       ~`A. Measured`, ~`B. Diagnosed`, ~`C. Undiagnosed`, ~`D. Composite`,
  "0. Abstainer",                     40.0, 34.5, 18.3, 53.0,
  "1. Former",                        46.0, 48.4, 19.2, 67.1,
  "2. Less than Once a Month",        36.7, 38.6, 16.2, 54.6,
  "3. Once a Month to Once a Week",   35.0, 33.9, 17.5, 51.2,
  "4. >1 to 3 Times per Week",        39.0, 35.4, 16.6, 52.0,
  "5. >3 Times per Week",             52.5, 43.6, 27.0, 69.4,
  "6. Binge 1-12 Times last year",    30.9, 22.5, 18.3, 40.8,
  "7. Binge >12 Times last year",     43.1, 30.6, 23.5, 53.7,
  "9. Missing",                       43.7, 30.0, 24.2, 54.0
)

plot_df <- prev |>
  pivot_longer(-consumption, names_to = "panel", values_to = "prev") |>
  mutate(
    consumption = factor(consumption, levels = consumption_levels),
    panel = factor(panel, levels = panel_levels)
  )

bar_fill  <- "#5E8CA8"   # calm steel-blue, drawn from the cohesion palette family
label_col <- "#2f3a45"

p <- ggplot(plot_df, aes(x = consumption, y = prev)) +
  geom_col(fill = bar_fill, width = 0.74) +
  geom_text(
    aes(label = sprintf("%.1f", prev)),
    vjust = -0.45, size = 3.0, colour = label_col
  ) +
  facet_wrap(~ panel, ncol = 2) +
  scale_x_discrete(labels = \(x) str_wrap(x, width = 11)) +
  scale_y_continuous(limits = c(0, 76), expand = expansion(mult = c(0, 0.02))) +
  labs(x = "Alcohol Consumption", y = "Prevalence %") +
  theme_minimal(base_size = 13, base_family = "sans") +
  theme(
    panel.grid.major.x = element_blank(),
    panel.grid.minor   = element_blank(),
    panel.grid.major.y = element_line(colour = "grey88", linewidth = 0.4),
    panel.spacing      = unit(16, "pt"),
    strip.text         = element_text(face = "bold", size = 13, hjust = 0,
                                      margin = margin(b = 6)),
    axis.text.x        = element_text(size = 8.5, colour = "grey30", lineheight = 0.95),
    axis.text.y        = element_text(colour = "grey30"),
    axis.title         = element_text(face = "bold"),
    axis.title.x       = element_text(margin = margin(t = 8)),
    axis.title.y       = element_text(margin = margin(r = 8)),
    plot.margin        = margin(12, 14, 10, 12)
  )

ggsave(out_png, plot = p, width = 12, height = 7.6, dpi = 200,
       device = ragg::agg_png, bg = "white")

cat("Wrote:", out_png, "\n")
