class Jekyll::PostReader
  # https://stackoverflow.com/questions/27099427/jekyll-filename-without-date
  # Don't use DATE_FILENAME_MATCHER so we don't need to put those stupid dates
  # in the filename. Also limit to just *.md, so it won't process binary
  # files from e.g. drafts.
  def read_posts(dir)
    read_publishable(dir, "_posts", /.*\.md$/)
  end
end
