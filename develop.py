#!/usr/bin/env python

"""Snickerdoodle develop.py

Usage:
  python develop.py <command>

Commands:
    activate    Show how to activate the virtualenv.
    clean       Clean up the environment.
    help        Show this help message.
    install     Install requirements using virtualenv.
    dev         Install requirements for developing using virtualenv.
"""

import glob
import os
import platform
import shutil
import subprocess
import sys

system = platform.system()

USE_UNIX = USE_WINDOWS = False
VIRTUAL_ENV_PATH = './lib/virtualenv.py'

if system in ('Windows', 'Microsoft'):
    USE_WINDOWS = True
else:
    USE_UNIX = True


def main():
    command_map = {
        'activate': activate,
        'clean': clean,
        'help': usage,
        'install': install,
        'dev': dev_install,
    }

    if len(sys.argv) == 1:
        return install()
    elif len(sys.argv) == 2:
        command = sys.argv[-1]

        if command in command_map:
            return command_map[command]()
        else:
            print 'Command {0} not found.'.format(command)
            return 1
    else:
        return usage()


def activate():
    if USE_WINDOWS:
        print "> ENV/Scripts/activate"
    elif USE_UNIX:
        print "$ source ENV/bin/activate"

    return 0


def usage():
    print __doc__
    return 1


def clean():
    print 'Removing ./ENV...'
    shutil.rmtree('./ENV', True)
    return 0


def dev_install():
    return install(dev=True)


def install(dev=True):
    # Install VirtualENV
    subprocess.call([sys.executable, VIRTUAL_ENV_PATH, '--system-site-packages', 'ENV'])

    if USE_WINDOWS:
        print 'Setting up ENV with Windows...\n'

        pip = './ENV/Scripts/pip'
        site_packages = 'ENV/Lib/site-packages'
    elif USE_UNIX:
        print 'Setting up ENV with Unix...\n'
        pip = './ENV/bin/pip'
        site_packages = 'ENV/lib/*/site-packages'

    # add paths to the environment
    paths = '\n'.join([
        os.path.abspath('.'),
        os.path.abspath('./windows/'),
    ])

    for dist in glob.glob(site_packages):
        with open(os.path.join(dist, 'develop.pth'), 'w') as f:
            f.write(paths)

    # Install our frozen dependencies
    subprocess.call([pip, 'install', '-r', 'requirements.txt'])

    if dev is True:
        subprocess.call([pip, 'install', '-r', 'requirements-dev.txt'])

    return 0

if __name__ == '__main__':
    sys.exit(main())
