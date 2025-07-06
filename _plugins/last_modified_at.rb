# Reference: https://github.com/gjtorikian/jekyll-last-modified-at/blob/master/lib/jekyll-last-modified-at/hook.rb
# License: MIT
# See third_party.html for more information

module Jekyll
  module LastModifiedAt
    module Hook
      def self.add_determinator_proc
        proc { |item|
          if !item.data["last_modified_at"] and (item.data["comment_date"] or item.data["date"]) then
            item.data["last_modified_at"] = item.data["comment_date"] or item.data["date"]
          end
        }
      end

      Jekyll::Hooks.register :posts, :post_render, &Hook.add_determinator_proc
      Jekyll::Hooks.register :pages, :post_render, &Hook.add_determinator_proc
      Jekyll::Hooks.register :documents, :post_render, &Hook.add_determinator_proc
    end
  end
end
