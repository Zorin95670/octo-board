DESTDIR=
VERSION=0.2.1~dev

all:
	@echo "Nothing to build"

install:
	mkdir -p $(DESTDIR)/usr/share/octo-board
	mkdir -p $(DESTDIR)/usr/share/doc/octo-board/html
	cp -r build/* $(DESTDIR)/usr/share/octo-board
	cp -r docs/* $(DESTDIR)/usr/share/doc/octo-board/html

uninstall:
	rm -rf $(DESTDIR)/usr/share/octo-board $(DESTDIR)/usr/share/doc/octo-board/html

dist:
	tar cJf octo-board-$(VERSION).tar.xz build docs Makefile README.md --transform "s,^,/octo-board-$(VERSION)/,"
